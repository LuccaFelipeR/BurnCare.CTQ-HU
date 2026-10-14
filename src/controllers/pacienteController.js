exports.index = (req, res) => {
  const pacientes = [
    {
      nome: "Paciente fictício 01",
      prontuario: "DEMO-HU-001"
    }
  ];

  res.render("pacientes/index", {
    titulo: "Pacientes",
    pacientes: pacientes
  });
};