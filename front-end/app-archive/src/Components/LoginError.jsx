import { Info } from "lucide-react";
import Swal from "sweetalert2";

const LoginErrorButton = () => {
  const handleErrorClick = () => {
    Swal.fire({
      title: "Problème de connexion ?",
      html: `
        <ul>
          <li>1.Vérifiez vos identifiants : login et mot de passe</li>
          <li>2.Assurez vous d'avoir un profil valide, actif et ayant au moins une action.</li>
          <li>3.Vous devriez peut être contacter l'administrateur .</li>
        </ul>

        <br />
        <span style="line-height:1.5em;">
        📝✍️
        Si rien de tout cela ne marche pas laissez nous un feedback en cliquant ici:
        <a 
        href="https://docs.google.com/forms/d/e/1FAIpQLSfKdEL0TYilfB5bu2LQpQNZIgGbkw1I7BbtJUfOZZZyrbOTuQ/viewform?usp=header"
         target="_blank" style="color:dodgerblue">
        feedback digi - doc
        </a>
        </span>
      `,
      icon: "info",
      confirmButtonColor: "#6b7280",

      confirmButtonText: "OK",
    });
  };

  return (
    <button
      onClick={handleErrorClick}
      className="fixed top-4 right-4 btn bg-red-600 text-white "
    >
      <Info />
    </button>
  );
};

export default LoginErrorButton;
