-- Crear la base de datos (opcional, si no existe)
-- CREATE DATABASE gestor_archivos_db;
-- \c gestor_archivos_db;

-- Tabla: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  sector VARCHAR(50) DEFAULT 'general' CHECK (sector IN ('comercio', 'banca', 'educacion')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  path VARCHAR(500) NOT NULL,
  size INT NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  user_id UUID NOT NULL,
  category_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla: emails
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  file_id UUID,
  sender_id UUID NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
