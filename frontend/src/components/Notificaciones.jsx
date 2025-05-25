import { useEffect, useState } from "react";
import axios from "../lib/axios"; // usa tu config de axios con withCredentials
import { format } from "date-fns";

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    axios.get("/notifications")
      .then((res) => {
        setNotificaciones(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener notificaciones", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>

      {notificaciones.length === 0 ? (
        <p>No hay notificaciones.</p>
      ) : (
        <ul className="space-y-4">
          {notificaciones.map((notif) => (
            <li key={notif.id} className="p-4 bg-white shadow rounded">
              <div className="text-sm text-gray-600 mb-1">
                {format(new Date(notif.created_at), "dd/MM/yyyy HH:mm")}
              </div>
              <div>
                {notif.data.tipo === "reserva_solicitada" && (
                    <span>
                    <strong>{notif.data.usuario_nombre}</strong> ha solicitado una reserva para <strong>{notif.data.mascota_nombre}</strong> del <strong>{notif.data.fecha_inicio.split("T")[0]}</strong> al <strong>{notif.data.fecha_fin.split("T")[0]}</strong>.
                    </span>
                )}

                {notif.data.tipo === "reserva_actualizada" && (
                    <span>
                    Tu reserva del <strong>{notif.data.fecha_inicio?.split("T")[0]}</strong> al <strong>{notif.data.fecha_fin?.split("T")[0]}</strong> fue <strong>{notif.data.estado}</strong> por <strong>{notif.data.cuidador_nombre}</strong>.
                    </span>
                )}
                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notificaciones;
