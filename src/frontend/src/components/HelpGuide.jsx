import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { IoClose, IoPlay, IoPause, IoExpand, IoContract } from 'react-icons/io5';
import { FaQuestionCircle } from 'react-icons/fa';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: var(--primary-color);
  color: white;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #eee;
  overflow-y: auto;
`;

const VideoSection = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TopicItem = styled.div`
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e9ecef;
  }
  
  &.active {
    background-color: var(--primary-color);
    color: white;
  }
`;

const VideoPlayer = styled.div`
  width: 100%;
  max-width: 600px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${VideoPlayer}:hover & {
    opacity: 1;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  color: var(--text-color);
`;

const Description = styled.p`
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

const helpTopics = [
  {
    id: 'create-project',
    title: 'Como adicionar um projeto',
    description: 'Aprenda a criar um novo projeto no sistema',
    video: '/videos/Guia Criar Projeto.mp4'
  },
  {
    id: 'add-building',
    title: 'Como adicionar um prédio',
    description: 'Adicione prédios ao seu projeto',
    video: '/videos/Guia Criar Predio.mp4'
  },
  {
    id: 'create-facade',
    title: 'Como adicionar uma fachada',
    description: 'Crie fachadas para análise de fissuras',
    video: '/videos/Guia Criar Fachada.mp4'
  },
  {
    id: 'upload-images',
    title: 'Como fazer upload de imagens',
    description: 'Envie imagens para análise automática',
    video: '/videos/Guia enviar fachada.mp4'
  },
  {
    id: 'add-fissure',
    title: 'Como adicionar fissuras',
    description: 'Adicione e gerencie fissuras nas imagens',
    video: '/videos/Guia Adicionar Fissura.mp4'
  },
  {
    id: 'view-report',
    title: 'Como criar e visualizar relatórios',
    description: 'Acesse e interprete os relatórios de análise',
    video: '/videos/Guia relatorio.mp4'
  },
  {
    id: 'retreinamento',
    title: 'Como retreinar o modelo',
    description: 'Retreine o modelo para melhorar a precisão da análise',
    video: '/videos/Guia Retreinamento.mp4'
  }
];

export default function HelpGuide({ isOpen, onClose }) {
  const [activeTopic, setActiveTopic] = useState(helpTopics[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.msRequestFullscreen) {
          videoRef.current.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  React.useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleTopicChange = (topic) => {
    setActiveTopic(topic);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <h2>Guia de Utilização</h2>
          <IoClose size={24} onClick={onClose} style={{ cursor: 'pointer' }} />
        </Header>
        
        <Content>
          <Sidebar>
            {helpTopics.map((topic) => (
              <TopicItem
                key={topic.id}
                className={activeTopic.id === topic.id ? 'active' : ''}
                onClick={() => handleTopicChange(topic)}
              >
                <Title>{topic.title}</Title>
                <Description>{topic.description}</Description>
              </TopicItem>
            ))}
          </Sidebar>
          
          <VideoSection>
            <VideoPlayer>
              <Video
                ref={videoRef}
                src={activeTopic.video}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                controls={false}
              />
              <VideoControls>
                <ControlButton onClick={handlePlayPause}>
                  {isPlaying ? <IoPause size={20} /> : <IoPlay size={20} />}
                </ControlButton>
                <ControlButton onClick={handleFullscreen}>
                  {isFullscreen ? <IoContract size={20} /> : <IoExpand size={20} />}
                </ControlButton>
              </VideoControls>
            </VideoPlayer>
          </VideoSection>
        </Content>
      </Modal>
    </Overlay>
  );
} 