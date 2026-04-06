import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard TontiPay</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Mes Tontines</h2>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Montant Cotisé</h2>
          <p className="text-2xl font-bold mt-2">0 FCFA</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Prochain Tour</h2>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
