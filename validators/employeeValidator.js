import mEmpleados from "../models/mEmpleados.js";

const nombreYApellidosRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
const usernameFormatRegex = /^[0-3]\d{3}$/;
const telefonoRegex = /^\d{10}$/;

const validarLongitudCampos = (empleado) => {
  return (
    empleado.nombre.length > 50 ||
    empleado.apellido_paterno.length > 50 ||
    empleado.apellido_materno.length > 50 ||
    empleado.direccion.length > 255
  );
};
const validarFormatoNombreApellidos = (empleado) => {
  return (
    !nombreYApellidosRegex.test(empleado.nombre) ||
    !nombreYApellidosRegex.test(empleado.apellido_paterno) ||
    !nombreYApellidosRegex.test(empleado.apellido_materno)
  );
};
const validarUsernameRolCoincidencia = (id_tipo_empleado, username) => {
  const tipoEmpleado = parseInt(id_tipo_empleado);
  const primerDigitoUsername = parseInt(username.charAt(0));

  if (tipoEmpleado === 1 && primerDigitoUsername !== 1)
    return "Para un vendedor (1), el usuario debe comenzar con 1.";
  if (tipoEmpleado === 2 && primerDigitoUsername !== 2)
    return "Para un gerente (2), el usuario debe comenzar con 2.";
  if (tipoEmpleado === 3 && primerDigitoUsername !== 3)
    return "Para un cajero (3), el usuario debe comenzar con 3.";
  return null;
};

export const employeeValidator = async (empleado) => {
  if (validarLongitudCampos(empleado)) {
    return {
      code: 400,
      title: "Error 400: Bad Request",
      isValid: false,
      message: "Algunos campos superan el limite de caracteres permitidos",
    };
  }
  if (validarFormatoNombreApellidos(empleado)) {
    return {
      code: 400,
      title: "Error 400: Bad Request",
      isValid: false,
      message:
        "El nombre y los apellidos solo deben contener letras y espacios.",
    };
  }
  if (empleado.telefono && !telefonoRegex.test(empleado.telefono)) {
    return {
      code: 400,
      title: "Error 400: Bad Request",
      isValid: false,
      message: "El teléfono debe tener 10 dígitos numéricos.",
    };
  }
  if (!usernameFormatRegex.test(empleado.username)) {
    return {
      code: 400,
      title: "Error 400: Bad Request",
      idValid: false,
      message:
        "El usuario debe tener 4 dígitos numéricos y comenzar con  1, 2 o 3.",
    };
  }
  const rolUsernameError = validarUsernameRolCoincidencia(
    empleado.id_tipo_empleado,
    empleado.username
  );
  if (rolUsernameError) {
    return {
      code: 400,
      idValid: false,
      title: "Error 400: Bad Request",
      message: rolUsernameError,
    };
  }
  return {
    isValid: true,
  };
};

export const validateEmployeeExistence = async (empleado) => {
  const empleadoExiste = await mEmpleados.buscarEmpleadoUnico(
    empleado.nombre,
    empleado.apellido_paterno,
    empleado.apellido_materno,
    empleado.telefono,
    empleado.direccion
  );
  if (empleadoExiste && empleadoExiste.length > 0) {
    return {
      code: 409,
      isValid: false,
      title: "Error 409: Conflict",
      message: `Ya existe un empleado con el nombre: ${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}, teléfono: ${empleado.telefono} y la misma dirección.`,
    };
  }
  return {
    isValid: true,
  };
};
export const validateUserExist = async (empleado) => {
  const existingUser = await mEmpleados.obtenerEmpleadoPorUsername(
    empleado.username
  );

  if (existingUser) {
    return {
      code: 400,
      isValid: false,
      title: "Error 400: Bad Request",
      message: `El usuario "${empleado.username}" ya existe.`,
    };
  }
  return {
    isValid: true,
  };
};
