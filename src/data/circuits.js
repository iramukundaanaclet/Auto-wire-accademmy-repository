export const circuits = {
  starting: {
    name: 'Starting System Circuit',
    components: [
      { id: 'battery', name: 'Battery', x: 100, y: 200, function: 'Provides electrical power', terminals: 'Positive (+) and Negative (-)' },
      { id: 'fuse', name: 'Fuse', x: 250, y: 200, function: 'Protects circuit from overcurrent', terminals: 'Input and output' },
      { id: 'ignition', name: 'Ignition Switch', x: 400, y: 200, function: 'Controls starting circuit', terminals: 'Multiple terminals' },
      { id: 'relay', name: 'Starter Relay', x: 550, y: 200, function: 'Controls high current to starter', terminals: 'Control and power circuits' },
      { id: 'solenoid', name: 'Starter Solenoid', x: 700, y: 200, function: 'Engages starter motor', terminals: 'Control, battery, motor' }
    ],
    connections: [
      { x1: 140, y1: 200, x2: 210, y2: 200, type: 'power' },
      { x1: 290, y1: 200, x2: 360, y2: 200, type: 'power' },
      { x1: 440, y1: 200, x2: 510, y2: 200, type: 'control' },
      { x1: 590, y1: 200, x2: 660, y2: 200, type: 'power' }
    ]
  },
  lighting: {
    name: 'Basic Lighting Circuit',
    components: [
      { id: 'battery', name: 'Battery', x: 100, y: 200, function: 'Provides electrical power', terminals: 'Positive (+) and Negative (-)' },
      { id: 'fuse', name: 'Fuse', x: 250, y: 200, function: 'Protects circuit from overcurrent', terminals: 'Input and output' },
      { id: 'switch', name: 'Switch', x: 400, y: 200, function: 'Controls light operation', terminals: 'Input and output' },
      { id: 'lamp', name: 'Lamp', x: 550, y: 200, function: 'Provides light when powered', terminals: 'Positive and negative' },
      { id: 'ground', name: 'Ground', x: 700, y: 200, function: 'Returns current to battery', terminals: 'Chassis connection' }
    ],
    connections: [
      { x1: 140, y1: 200, x2: 210, y2: 200, type: 'power' },
      { x1: 290, y1: 200, x2: 360, y2: 200, type: 'power' },
      { x1: 440, y1: 200, x2: 510, y2: 200, type: 'power' },
      { x1: 590, y1: 200, x2: 660, y2: 200, type: 'ground' }
    ]
  },
  charging: {
    name: 'Charging System Circuit',
    components: [
      { id: 'battery', name: 'Battery', x: 100, y: 200, function: 'Stores electrical energy', terminals: 'Positive (+) and Negative (-)' },
      { id: 'alternator', name: 'Alternator', x: 300, y: 200, function: 'Generates electrical power', terminals: 'Output, ground, field' },
      { id: 'regulator', name: 'Voltage Regulator', x: 500, y: 200, function: 'Controls charging voltage', terminals: 'Input, output, ground' },
      { id: 'ecm', name: 'ECM/PCM', x: 700, y: 200, function: 'Controls charging system', terminals: 'Multiple connections' }
    ],
    connections: [
      { x1: 140, y1: 200, x2: 260, y2: 200, type: 'power' },
      { x1: 340, y1: 200, x2: 460, y2: 200, type: 'control' },
      { x1: 540, y1: 200, x2: 660, y2: 200, type: 'control' }
    ]
  }
}
