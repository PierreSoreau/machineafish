<?php

class AuthController extends AbstractController
{
    public function home() : void
    {
        $this->render('templates/home_page.html.twig', []);
    }

    public function login(): void
        {
            $errors = [];

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                
                // 1. Vérification des champs vides
                if (empty($_POST["email"]) || empty($_POST["password"])) {
                    $errors[] = "Veuillez remplir tous les champs !";
                }
                if (empty($errors)) {
                    $manager = new UserManager();
                    $user = $manager->findByEmail($_POST["email"]);
                    if ($user !== null) {
                        $hashedPassword = $user->getPassword();
                        if (password_verify($_POST["password"], $hashedPassword)) {
                            $_SESSION["id"] = $user->getId();
                            $_SESSION['firstname'] = $user->getFirstName();
                            $_SESSION['lastname'] = $user->getLastName();
                            $_SESSION['email'] = $user->getEmail();
                            $_SESSION['role'] = $user->getRole();
                            $this->redirect("index.php?route=home");
                            exit;
                        } else {
                            $errors[] = "Identifiants incorrects (mot de passe).";
                        }
                    } else {
                        $errors[] = "Identifiants incorrects (email).";
                    }
                }
            }

            $this->render('auth/login.html.twig', ['errors' => $errors]);
        }


    public function logout() : void
    {
        session_destroy();
        $this->redirect('index.php?route=login');
    }

    public function register(): void
    {
        $errors = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST')
        {
            if (empty($_POST["firstname"]) || empty($_POST["lastname"]) || empty($_POST["email"]) || empty($_POST["password"]) || empty($_POST["confirmPassword"]))
            {  
                $errors[] = "Veuillez remplir tous les champs !";
            }
            $manager = new UserManager();
            $userCandidat = $manager->findByEmail($_POST["email"]);
            if ($userCandidat !== null)
            {
                $errors[] = "Cet email est déjà utilisé !";
            }
            if ($_POST["password"] !== $_POST["confirmPassword"])
            {
                $errors[] = "Les mots de passe ne correspondent pas !";
            }
            if (empty($errors)) {
                $hashedPassword = password_hash($_POST['password'], PASSWORD_DEFAULT);
                
                $userToCreate = new User(
                    $_POST['email'],
                    $hashedPassword,
                    $_POST['firstname'],
                    $_POST['lastname'],
                    "USER"
                );
                $manager->create_user($userToCreate);
                $this->redirect('index.php?route=login');
                exit;
            }
        }
        
        $this->render('auth/register.html.twig', ['errors' => $errors]);
    }

    public function notFound() : void
    {
        $this->render('error/notFound.html.twig', []);
    }

    public function page_connexion(): void
        {
            $this->render('auth/page_connexion.html.twig', []);
        }
}