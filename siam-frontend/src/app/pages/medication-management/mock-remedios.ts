export const MOCK_MEDICAMENTOS = [
    {
      name: 'Paracetamol',
      dosage: 500,
      startDate: '2023-09-01',
      endDate: '2023-09-10',
      administrationSchedules: [
        { time: '08:00', daysOfWeek: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'] },
        { time: '20:00', daysOfWeek: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'] }
      ]
    },
    {
      name: 'Ibuprofeno',
      dosage: 400,
      startDate: '2023-09-05',
      endDate: '2023-09-15',
      administrationSchedules: [
        { time: '12:00', daysOfWeek: ['Terça-feira', 'Quinta-feira'] }
      ]
    }
  ];