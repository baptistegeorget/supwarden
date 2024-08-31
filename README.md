# 🔑 SUPWARDEN

SUPWARDEN is a web application for managing and storing passwords.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (Optional)
- [npm](https://www.npmjs.com/) (Optional)
- [Git](https://git-scm.com/) (Optional)
- [Docker](https://www.docker.com/) (Optional)

## 🛠️ Installation

1. Clone the repository (or download zip file)

    ```bash
    git clone https://github.com/baptistegeorget/supwarden.git
    ```

2. Navigate to the project

    ```bash
    cd supwarden
    ```

## ⚙️ Configuration

Follow instructions in [.env.local.exemple](.env.local.exemple)

_For advanced configuration you can edit [docker-compose.yaml](docker-compose.yaml)_

## 🚀 Running the Project

### 🐋 With Docker

```bash
docker-compose up
```

### 💻 Without Docker

Bash
```bash
npm install && npm run build && npm start
```

PowerShell
```powershell
npm install; npm run build; npm start
```
