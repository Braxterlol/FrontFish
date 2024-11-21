  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Cookies from "js-cookie"; // Importamos la librería para manejar cookies

  function SignInForm() {
    const [state, setState] = useState({
      email: "",
      password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (evt) => {
      const value = evt.target.value;
      setState({
        ...state,
        [evt.target.name]: value,
      });
    };

    const handleOnSubmit = async (evt) => {
      evt.preventDefault();

      const { email, password } = state;

      if (!email || !password) {
        setError("Por favor, ingresa tu correo y contraseña.");
        return;
      }

      try {
        const response = await fetch("https://fishmaster.duckdns.org/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        

        const data = await response.json();

        if (response.ok) {
          // Guardar el token en cookies
          Cookies.set("token", data.token, { expires: 1 }); // Expira en 1 día
          localStorage.setItem("userId", data.userId); 
          console.log("Token enviado en la solicitud:", data.token);

          const isFirstLogin = Cookies.get("isFirstLogin");
          if (isFirstLogin === undefined) {
            Cookies.set("isFirstLogin", "false");
            navigate("/Registro");
          } else {
            navigate("/Home");
          }
          
        } else {
          setError(data.message || "Inicio de sesión fallido. Intenta de nuevo.");
        }
      } catch (error) {
        setError("Ocurrió un error: " + error.message);
      }

      setState({
        email: "",
        password: "",
      });
    };

    return (
      <div className="form-container sign-in-container">
        <form onSubmit={handleOnSubmit}>
          <h1>Iniciar sesión</h1>
          <input
            placeholder="Correo"
            name="email"
            value={state.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={state.password}
            onChange={handleChange}
          />
          <button>Iniciar sesión</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  export default SignInForm;
