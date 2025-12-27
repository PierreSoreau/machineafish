<?php

abstract class AbstractManager
{
    protected PDO $db;

    public function __construct()
    {
        $host = $_ENV['SUPABASE_DB_HOST'] ; 
        $port = $_ENV['SUPABASE_DB_PORT'] ;
        $dbname = $_ENV['SUPABASE_DB_NAME'] ;
        $user = $_ENV['SUPABASE_DB_USER'] ;
        $password = $_ENV['SUPABASE_DB_PASSWORD'] ;
        
         try {
            $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
            $this->db = new \PDO($dsn, $user, $password, [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION
            ]);
        } catch (\PDOException $e) {            
            die('Erreur de connexion à la base de données Supabase : ' . $e->getMessage());
        }
    }
    }
