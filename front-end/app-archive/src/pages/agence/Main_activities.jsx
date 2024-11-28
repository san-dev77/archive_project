import { useState, useEffect } from "react";
import Topbar from "../../Components/Top_bar";
import { Card } from "primereact/card";
import SideBar_agence from "../../Components/Sidebar_agence";
import { School } from "lucide-react";
// import Loader from "../../components/Loader";

export default function Main_activities() {
  const [, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-4 mt-20">
          {/* {loading ? (
            <Loader />
          ) : ( */}
          <div>
            {/* Grande card stylée */}
            <Card
              className="shadow-xl rounded-lg p-6 mb-6 bg-gray-800 text-white"
              title="AGENCES"
              style={{ textAlign: "center", fontSize: "1.5em" }}
            >
              <p className="flex items-center justify-center gap-2">
                <School size={30} color="white" />
                Bienvenue dans la section des agences
              </p>
            </Card>

            {/* Autres cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                className="rounded-lg p-4 shadow-xl transition-shadow duration-300"
                title="Agences"
                subTitle="152"
                style={{ textAlign: "center" }}
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
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
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
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                title="Suivis"
                subTitle="28,441"
                style={{ textAlign: "center" }}
              >
                <i
                  className="pi pi-chart-line rounded-full bg-gray-600 p-2 text-white"
                  style={{ fontSize: "2em" }}
                ></i>
                <p className="text-gray-600">
                  520 suivis depuis la dernière visite
                </p>
              </Card>
              <Card
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
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
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
