from datetime import datetime
import uuid
from app.Repositories.ReportRepository import ReportRepository

class ReportService:
    def __init__(self):
        self.repo = ReportRepository()

    def generate_project_report(self, project_id: int):
        """
        Orquestra a criação do relatório.

        Pega os dados brutos do repositório e os processa para
        montar o dicionário final do relatório com todas as agregações.
        """
        project, raw_data = self.repo.get_report_data_for_project(project_id)

        if not project:
            return None # Retorna None se o projeto não for encontrado

        # Estruturas para agregar os dados
        report = {
            "informacoes_gerais": {},
            "resumo_quantitativo_projeto": {
                "total_imagens_analisadas": 0,
                "total_imagens_com_fissura": 0,
                "total_fissuras_por_tipo": {}
            },
            "detalhamento_por_predio": []
        }
        
        # Dicionários auxiliares para facilitar a agregação
        buildings_map = {}

        # Processa os dados brutos
        for image, facade, building in raw_data:
            # Agregação geral do projeto
            report["resumo_quantitativo_projeto"]["total_imagens_analisadas"] += 1
            if image.fissure_type:
                report["resumo_quantitativo_projeto"]["total_imagens_com_fissura"] += 1
                report["resumo_quantitativo_projeto"]["total_fissuras_por_tipo"][image.fissure_type] = \
                    report["resumo_quantitativo_projeto"]["total_fissuras_por_tipo"].get(image.fissure_type, 0) + 1

            # Agregação por prédio
            if building.id not in buildings_map:
                buildings_map[building.id] = {
                    "id_predio": building.id,
                    "nome_predio": building.name,
                    "resumo_quantitativo_predio": {
                        "total_imagens": 0,
                        "total_imagens_com_fissura": 0,
                        "fissura_termica": 0,
                        "fissura_retracao": 0
                    },
                    "fachadas": {},
                    "fachadas_list": [] # Usaremos para a conversão final
                }
            
            b_summary = buildings_map[building.id]["resumo_quantitativo_predio"]
            b_summary["total_imagens"] += 1
            if image.fissure_type:
                b_summary["total_imagens_com_fissura"] += 1
                if image.fissure_type in b_summary:
                    b_summary[image.fissure_type] += 1
            
            # Agregação por fachada
            facades_map = buildings_map[building.id]["fachadas"]
            if facade.id not in facades_map:
                facades_map[facade.id] = {
                    "id_fachada": facade.id,
                    "nome_fachada": facade.name,
                    "resumo_quantitativo_fachada": {
                        "total_imagens": 0,
                        "fissura_termica": 0,
                        "fissura_retracao": 0
                    }
                }
            
            f_summary = facades_map[facade.id]["resumo_quantitativo_fachada"]
            f_summary["total_imagens"] += 1
            if image.fissure_type and image.fissure_type in f_summary:
                f_summary[image.fissure_type] += 1

        # Transforma os mapas em listas para o JSON final
        for building_id, building_data in buildings_map.items():
            building_data["fachadas_list"] = list(building_data["fachadas"].values())
            del building_data["fachadas"] # Remove o mapa auxiliar
            report["detalhamento_por_predio"].append(building_data)

        # Preenche as informações gerais no final
        report["informacoes_gerais"] = {
            "id_relatorio": f"REP-{uuid.uuid4().hex[:10].upper()}",
            "nome_projeto": project.name,
            "nome_contratante": "Não implementado", # Substituir pelo campo correto do modelo Project, se existir
            "data_emissao_relatorio": datetime.utcnow().isoformat() + "Z",
            "modelo_utilizado": "Não implementado" # Substituir pelo campo correto
        }

        return report