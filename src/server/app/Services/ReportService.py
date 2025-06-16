# Em app/Services/ReportService.py

from datetime import datetime
import uuid
from app.Repositories.ReportRepository import ReportRepository

class ReportService:
    def __init__(self):
        self.repo = ReportRepository()

    def generate_project_report(self, project_id: int):
        project, raw_data = self.repo.get_report_data_for_project(project_id)

        if not project:
            return None

        report = {
            "informacoes_gerais": {},
            "resumo_quantitativo_projeto": {
                "total_imagens_analisadas": 0,
                "total_imagens_com_fissura": 0,
                "total_fissuras_por_tipo": {}
            },
            "detalhamento_por_predio": []
        }
        
        buildings_map = {}

        for image, facade, building in raw_data:
            report["resumo_quantitativo_projeto"]["total_imagens_analisadas"] += 1

            if image.fissure: # Verifica se existe uma fissura associada
                report["resumo_quantitativo_projeto"]["total_imagens_com_fissura"] += 1
                
                fissure_name = image.fissure.fissure_name # Pega o nome da fissura pela relação
                
                report["resumo_quantitativo_projeto"]["total_fissuras_por_tipo"][fissure_name] = \
                    report["resumo_quantitativo_projeto"]["total_fissuras_por_tipo"].get(fissure_name, 0) + 1

            if building.id not in buildings_map:
                buildings_map[building.id] = {
                    "id_predio": building.id,
                    "nome_predio": building.predio, #
                    "resumo_quantitativo_predio": {
                        "total_imagens": 0, "total_imagens_com_fissura": 0
                    },
                    "fachadas": {}, "fachadas_list": []
                }
            
            b_summary = buildings_map[building.id]["resumo_quantitativo_predio"]
            b_summary["total_imagens"] += 1
            if image.fissure:
                b_summary["total_imagens_com_fissura"] += 1
                fissure_name = image.fissure.fissure_name
                b_summary[fissure_name] = b_summary.get(fissure_name, 0) + 1
            
            facades_map = buildings_map[building.id]["fachadas"]
            if facade.id not in facades_map:
                facades_map[facade.id] = {
                    "id_fachada": facade.id,
                    "nome_fachada": facade.name,
                    "resumo_quantitativo_fachada": {"total_imagens": 0}
                }
            
            f_summary = facades_map[facade.id]["resumo_quantitativo_fachada"]
            f_summary["total_imagens"] += 1
            if image.fissure:
                fissure_name = image.fissure.fissure_name
                f_summary[fissure_name] = f_summary.get(fissure_name, 0) + 1

        for building_id, building_data in buildings_map.items():
            building_data["fachadas_list"] = list(building_data["fachadas"].values())
            del building_data["fachadas"]
            report["detalhamento_por_predio"].append(building_data)

        report["informacoes_gerais"] = {
            "id_relatorio": f"REP-{uuid.uuid4().hex[:10].upper()}",
            "nome_projeto": project.name,
            "nome_contratante": project.contractor, 
            "data_emissao_relatorio": datetime.utcnow().isoformat() + "Z",
            "modelo_utilizado": "YOLOv8-cls-v1.2" # Exemplo, idealmente viria do banco no futuro
        }

        return report