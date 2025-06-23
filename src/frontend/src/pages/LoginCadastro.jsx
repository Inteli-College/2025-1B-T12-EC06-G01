import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../logo.svg'
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #629EBC 0%, #0A3B4E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: #629EBC;
  border-radius: 50%;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: bold;
`;

const Title = styled.h2`
  text-align: center;
  color: #0A3B4E;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 5px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  background: ${props => props.active ? '#629EBC' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#629EBC' : '#e0e0e0'};
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #629EBC;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #629EBC 0%, #0A3B4E 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #ffe6e6;
  color: #d32f2f;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
  border: 1px solid #ffcdd2;
`;

const SuccessMessage = styled.div`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
  border: 1px solid #c8e6c9;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function LoginRegister() {
    const navigate = useNavigate(); // NOVO: Inicialize o hook
    const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // 1. Salve o token no localStorage para ser usado em outras requisições
        localStorage.setItem('jwt_token', data.token); 
        
        setMessage({ type: 'success', text: 'Login realizado com sucesso! Redirecionando...' });
        
        // 2. Redirecione o usuário para a página de projetos após um pequeno atraso
        setTimeout(() => {
          navigate('/projects'); // Usa o navigate para ir para a página de projetos
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Erro ao fazer login' }); // Usando data.message para a msg do backend
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validação de senha
    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Usuário cadastrado com sucesso! Faça login para continuar.' });
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => {
          setActiveTab('login');
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao cadastrar usuário' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (formType, field, value) => {
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Container>
      <FormContainer>
        <Logo><img src={logo} width='50%' alt='ovo com rachadura' /></Logo>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'login'} 
            onClick={() => setActiveTab('login')}
            type="button"
          >
            Login
          </Tab>
          <Tab 
            active={activeTab === 'register'} 
            onClick={() => setActiveTab('register')}
            type="button"
          >
            Cadastro
          </Tab>
        </TabContainer>

        {message.text && (
          message.type === 'error' ? 
            <ErrorMessage>{message.text}</ErrorMessage> :
            <SuccessMessage>{message.text}</SuccessMessage>
        )}

        {activeTab === 'login' ? (
          <>
            <Title>Entrar na sua conta</Title>
            <Form>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </InputGroup>
              
              <InputGroup>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={loginData.password}
                  onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </InputGroup>

              <Button onClick={handleLoginSubmit} disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : 'Entrar'}
              </Button>
            </Form>
          </>
        ) : (
          <>
            <Title>Criar nova conta</Title>
            <Form>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Nome completo"
                  value={registerData.name}
                  onChange={(e) => handleInputChange('register', 'name', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </InputGroup>
              
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </InputGroup>
              
              <InputGroup>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={registerData.password}
                  onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                  required
                  disabled={isLoading}
                  minLength="6"
                />
              </InputGroup>
              
              <InputGroup>
                <Input
                  type="password"
                  placeholder="Confirmar senha"
                  value={registerData.confirmPassword}
                  onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                  required
                  disabled={isLoading}
                  minLength="6"
                />
              </InputGroup>

              <Button onClick={handleRegisterSubmit} disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : 'Cadastrar'}
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </Container>
  );
}