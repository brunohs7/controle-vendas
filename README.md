# Aplicativo de Controle de Vendas  

Este projeto foi desenvolvido como parte de um Projeto de Extensão da Faculdade Estácio, na disciplina **Programação para Dispositivos Móveis em Android**. O objetivo do aplicativo é gerenciar vendas, custos e comissões de forma prática e eficiente, utilizando tecnologias modernas.  

## Funcionalidades  

- **Login e autenticação** com JWT.  
- Cadastro e visualização de vendas.  
- Integração com banco de dados remoto por meio de uma API em PHP.  
- Suporte a operações financeiras, incluindo cálculo de custo e comissão.  
- Interface simples e responsiva.  

## Tecnologias Utilizadas  

### Frontend  
- React Native com Expo.  
- AsyncStorage (substituído por integração com API).  
- Máscaras de entrada para valores e datas.  

### Backend  
- PHP para APIs REST.  
- Banco de dados MySQL, configurado via phpMyAdmin.  

## Estrutura do Projeto  

- `/php`: Contém os arquivos PHP utilizados para o backend.  
- `/src`: Código-fonte do aplicativo React Native.  
- `/assets`: Imagens e outros arquivos estáticos.  
- `.env` (não incluído): Arquivo para configurar credenciais e URLs do backend.  

## Instruções de Uso  

### Clone o repositório:  
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

###Configure o backend:

- Importe o arquivo SQL do banco de dados (se fornecido).
- Atualize as credenciais e URLs nos arquivos PHP e no arquivo .env.

###Configure o frontend:

- Instale as dependências:
```bash
npm install
```
- Execute o aplicativo:
```bash
expo start
```

##Notas Importantes
- As credenciais e URLs foram removidas por razões de segurança.
- Para utilizar o aplicativo, insira suas configurações no arquivo .env e no backend.

##Contribuição

Contribuições são bem-vindas! Se você tiver sugestões ou encontrar problemas, fique à vontade para abrir uma issue ou enviar um pull request.
