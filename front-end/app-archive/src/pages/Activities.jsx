import { useState, useEffect } from "react";
import axios from "axios";
import Side_bar from "../Components/Side_bar"; // Assurez-vous que l'importation est correcte
import Topbar from "../Components/Top_bar";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { useNavigate } from "react-router-dom";

export default function Activities() {
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3000/agents/");
        setRecentUsers(usersResponse.data.slice(0, 5));
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "#42A5F5",
        tension: 0.4,
      },
      {
        label: "Second Dataset",
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: "#66BB6A",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Side_bar isVisible={true} />{" "}
      {/* Assurez-vous que la Side_bar est visible */}
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-4 mt-20">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                  className=" cursor-pointer rounded-lg p-4 shadow-xl transition-shadow duration-300"
                  title="Agences"
                  subTitle="152"
                  style={{ textAlign: "center" }}
                  onClick={() => navigate("/agences")}
                >
                  <i
                    className="pi pi-building-columns rounded-full bg-gray-600 p-2 text-white"
                    style={{ fontSize: "2em" }}
                  ></i>
                  <p className="text-gray-600">
                    200 agences depuis la dernière visite
                  </p>
                </Card>
                <Card
                  className="cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                  title="Historique"
                  subTitle="$2,100"
                  style={{ textAlign: "center" }}
                >
                  <i
                    className="pi pi-history rounded-full bg-gray-600 p-2 text-white"
                    style={{ fontSize: "2em" }}
                  ></i>
                  <p className="text-gray-600">
                    520 historiques depuis la dernière visite
                  </p>
                </Card>
                <Card
                  className="cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                  title="Suivis"
                  subTitle="28,441"
                  style={{ textAlign: "center" }}
                >
                  <i
                    className="pi pi-chart-line rounded-full  bg-gray-600 p-2 text-white"
                    style={{ fontSize: "2em" }}
                  ></i>
                  <p className="text-gray-600">
                    520 suivis depuis la dernière visite
                  </p>
                </Card>
                <Card
                  className="cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                  title="Dossiers partagés"
                  subTitle="20"
                  style={{ textAlign: "center" }}
                >
                  <i
                    className="pi pi-share-alt rounded-full bg-gray-600 p-2 text-white"
                    style={{ fontSize: "2em" }}
                  ></i>
                  <p className="text-gray-600">0 dossiers récents partagés</p>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div
                  className="cursor-pointer shadow-lg rounded-lg p-4 bg-white"
                  style={{ height: "350px" }}
                >
                  <Chart type="line" data={chartData} options={chartOptions} />
                </div>
                <div
                  className="cursor-pointer shadow-lg rounded-lg p-4 bg-white"
                  style={{ height: "350px" }}
                >
                  <Card title="Utilisateurs récents">
                    <ul className="list-none mt-4">
                      {recentUsers.map((user) => (
                        <li
                          key={user.id}
                          className="flex items-center py-3 border-b border-gray-200"
                        >
                          <div className="avatar bg-gray-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                            {user.prenom[0]}
                            {user.nom[0]}
                          </div>
                          <div className="ml-4">
                            <p className="text-md font-medium text-gray-900">{`${user.prenom} ${user.nom}`}</p>
                            <p className="text-sm text-gray-600">{`${user.nom_role} - ${user.nom_service}`}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
