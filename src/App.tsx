import './App.css'
import { useState } from 'react'
import Axios from 'axios';
import { Empleado } from './interfaces/empleado';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const noti = withReactContent(Swal);

function App() {
  const baseUrl = import.meta.env.VITE_BAKCEND_URL;
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState<number | null>(null);
  const [pais, setPais] = useState('');
  const [cargo, setCargo] = useState('');
  const [anios, setAnios] = useState<number | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [listaEmpleados, setListaEmpleados] = useState<Empleado[]>([]);
  const [editarEmpleado, setEditarEmpleado] = useState(false);

  const getEmpleados = () => {
    Axios.get<Empleado[]>(`${baseUrl}/api/empleados/listarEmpleados`)
      .then((response) => {
        setListaEmpleados(response.data);
      });
  }

  const agregarDatos = () => {
    //url, cuerpo
    Axios.post(`${baseUrl}/api/empleados/create`, {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    })
      .then(() => {
        getEmpleados();
        limpiarCampos();
        noti.fire({
          title: <strong>Registro exitoso!</strong>,
          html: <i>El empleado <strong>{nombre}</strong> ha sido registrado con éxito</i>,
          icon: 'success',
          timer: 3000
        })
      }).catch((error): void => {
        noti.fire({
          icon: 'error',
          title: 'Error 500',
          text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Error interno del servidor, intente más tarde" : JSON.parse(JSON.stringify(error)).message,
          timer: 3000
        })
      });
  }

  const actualizarDatos = () => {
    //url, cuerpo
    Axios.put(`${baseUrl}/api/empleados/updateEmpleados`, {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    })
      .then(() => {
        getEmpleados();
        limpiarCampos();
        noti.fire({
          title: <strong>Actualización exitosa!</strong>,
          html: <i>El empleado <strong>{nombre}</strong> ha sido actualizado con éxito</i>,
          icon: 'success',
          timer: 3000
        })
      });
  }

  const deleteEmpleados = (val: any) => {
    noti.fire({
      title: <strong>Confirmar eliminado?</strong>,
      html: <i>Realmente desea elimnar a <strong>{val.nombre}?</strong></i>,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Si, eliminar",
      timer: 3000
    }).then(result => {
      if (result.isConfirmed) {
        //url, cuerpo
        Axios.delete(`${baseUrl}/api/empleados/deleteEmpleados/${val.id}`)
          .then(() => {
            getEmpleados();
            limpiarCampos();
            noti.fire({
              title: 'Eliminado!',
              html: `El empleado ${val.nombre} ha sido eliminado con éxito`,
              icon: 'success',
              timer: 3000
            });
          }).catch((error): void => {
            noti.fire({
              icon: 'error',
              title: 'Error 500',
              text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Error interno del servidor, intente más tarde" : JSON.parse(JSON.stringify(error)).message,
              timer: 3000
            })
          });
      } else if (result.dismiss) {
        noti.fire({
          title: 'Operación cancelada',
          html: 'No se ha eliminado ningún empleado',
          icon: 'error',
          timer: 3000
        });
      }
    })
  }

  const limpiarCampos = () => {
    setNombre('');
    setEdad(null);
    setPais('');
    setCargo('');
    setAnios(null);
    setId(null);
    setEditarEmpleado(false);
  }

  const handleEditarEmpleado = (val: any) => {
    setEditarEmpleado(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setPais(val.pais);
    setAnios(val.anios);
    setId(val.id);
  }

  getEmpleados(); // ejecutar al cargar la página para cargar los empleados al estado inicial de la aplicación.


  return (
    <>
      <div className="container">
        <div className="card text-center">
          <div className="card-header">
            GESTIÓN DE EMPLEADOS
          </div>
          <div className="card-body">
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Nombre:</span>
              <input
                type="text"
                onChange={(event) => {
                  setNombre(event.target.value);
                }}
                className="form-control"
                value={nombre}
                placeholder="Ingrese un nombre"
                aria-label="Username"
                aria-describedby="basic-addon1" />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Edad: </span>
              <input
                type="number"
                onChange={(event) => {
                  const value = event.target.value !== '' ? Number(event.target.value) : null;
                  setEdad(value);
                }}
                className="form-control"
                value={edad !== null ? edad : ''}
                placeholder="Ingrese una edad"
                aria-label="Username"
                aria-describedby="basic-addon1" />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">País: </span>
              <input
                type="text"
                onChange={(event) => {
                  setPais(event.target.value);
                }}
                value={pais}
                className="form-control"
                placeholder="Ingrese un país"
                aria-label="Username"
                aria-describedby="basic-addon1" />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Cargo: </span>
              <input
                type="text"
                onChange={(event) => {
                  setCargo(event.target.value);
                }}
                value={cargo}
                className="form-control"
                placeholder="Ingrese un cargo"
                aria-label="Username"
                aria-describedby="basic-addon1" />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Años de experiencia: </span>
              <input
                type='number'
                onChange={(event) => {
                  const value = event.target.value !== '' ? Number(event.target.value) : null;
                  setAnios(value);
                }}
                value={anios !== null ? anios : ''}
                className="form-control"
                placeholder="Ingrese los años de experiencia"
                aria-label="Username"
                aria-describedby="basic-addon1" />
            </div>
          </div>

          <div className="card-footer text-muted">
            {
              editarEmpleado ?
                <div>
                  <button className='btn btn-warning m-2' onClick={actualizarDatos}>Actualizar</button>
                  <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
                </div>
                : <button className='btn btn-success' onClick={agregarDatos}>Registar</button>
            }
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">País</th>
              <th scope="col">Cargo</th>
              <th scope="col">Experiencia</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              listaEmpleados.map((val) => {
                return (
                  <tr key={val.id}>
                    <th>{val.id}</th>
                    <td>{val.nombre}</td>
                    <td>{val.edad}</td>
                    <td>{val.pais}</td>
                    <td>{val.cargo}</td>
                    <td>{val.anios}</td>
                    <td>
                      <div className="btn-group" role="group" aria-label="Basic example">
                        <button
                          type="button"
                          onClick={() => {
                            handleEditarEmpleado(val);
                          }}
                          className="btn btn-info">Editar</button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteEmpleados(val);
                          }}
                          className="btn btn-danger">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>

      </div>
    </>
  )
}

export default App
