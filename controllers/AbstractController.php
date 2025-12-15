<?php

class AbstractController
{
    private \Twig\Environment $twig;
    protected \PDO $db;
    public function __construct()
    {
        $loader = new \Twig\Loader\FilesystemLoader('templates');
        $twig = new \Twig\Environment($loader,[
            'debug' => true,
        ]);
        $twig->addGlobal('session', $_SESSION);
        $twig->addExtension(new \Twig\Extension\DebugExtension());
        $this->twig = $twig;
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

    protected function render(string $template, array $data) : void
    {
        echo $this->twig->render($template, $data);
    }

    protected function redirect(string $url) : void
    {
        header('Location: '.$url);
        exit;
    }
}
