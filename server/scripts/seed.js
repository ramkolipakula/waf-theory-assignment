import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../src/models/User.js';
import { Department } from '../src/models/Department.js';
import { Issue } from '../src/models/Issue.js';
import { Comment } from '../src/models/Comment.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicconnect';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected successfully. Resetting collections...');

    // Clear existing records
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Issue.deleteMany({}),
      Comment.deleteMany({}),
    ]);
    console.log('Cleared existing collections.');

    // 1. Seed Municipal Departments
    const departmentsData = [
      {
        name: 'Sanitation Department',
        code: 'SAN-DEPT',
        categories: ['Garbage & Sanitation'],
        description: 'Handles municipal solid waste management, illegal dumps, street sweeping, and recycling.',
        contactEmail: 'sanitation@civicconnect.gov',
        contactPhone: '+1 (555) 019-2831',
        headOfDepartment: 'Director Rajesh Khurana',
      },
      {
        name: 'Roads & Public Works',
        code: 'RPW-DEPT',
        categories: ['Road Damage & Potholes'],
        description: 'Oversees arterial roadways, lane repair, asphalt laying, and pothole patching.',
        contactEmail: 'publicworks@civicconnect.gov',
        contactPhone: '+1 (555) 019-4492',
        headOfDepartment: 'Chief Engineer Sunita Rao',
      },
      {
        name: 'Electrical Department',
        code: 'ELEC-DEPT',
        categories: ['Streetlights'],
        description: 'Maintains streetlights, traffic signals, transformers, and public outdoor illumination.',
        contactEmail: 'electrical@civicconnect.gov',
        contactPhone: '+1 (555) 019-8233',
        headOfDepartment: 'Superintendent Vikram Joshi',
      },
      {
        name: 'Water Board',
        code: 'WTR-DEPT',
        categories: ['Water Leakage'],
        description: 'Maintains municipal drinking water supply, mains pipelines, and public valves.',
        contactEmail: 'waterboard@civicconnect.gov',
        contactPhone: '+1 (555) 019-5511',
        headOfDepartment: 'Officer Farhan Siddiqui',
      },
      {
        name: 'Drainage & Sewerage Department',
        code: 'DRN-DEPT',
        categories: ['Drainage & Sewage'],
        description: 'Manages storm drains, underground sewage systems, and flood mitigation canals.',
        contactEmail: 'drainage@civicconnect.gov',
        contactPhone: '+1 (555) 019-7714',
        headOfDepartment: 'Director Meera Nair',
      },
      {
        name: 'Public Infrastructure Department',
        code: 'INFRA-DEPT',
        categories: ['Public Infrastructure', 'Other'],
        description: 'Oversees municipal buildings, footbridges, public parks, bus stops, and civic monuments.',
        contactEmail: 'infrastructure@civicconnect.gov',
        contactPhone: '+1 (555) 019-9940',
        headOfDepartment: 'Chief Architect David Miller',
      },
    ];

    const departments = await Department.insertMany(departmentsData);
    console.log(`Seeded ${departments.length} municipal departments.`);

    const deptMap = {};
    departments.forEach((d) => {
      deptMap[d.name] = d._id;
    });

    // 2. Seed Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Civic2025!';
    const citizenPassword = 'Citizen@123456';

    const adminHash = await bcrypt.hash(adminPassword, salt);
    const citizenHash = await bcrypt.hash(citizenPassword, salt);

    const adminUser = await User.create({
      name: 'Commissioner Sarah Jenkins',
      email: (process.env.ADMIN_DEFAULT_EMAIL || 'admin@civicconnect.org').toLowerCase(),
      passwordHash: adminHash,
      role: 'admin',
      neighborhood: 'Civic Center District',
      phone: '+1 (555) 010-0001',
    });

    const citizen1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      passwordHash: citizenHash,
      role: 'citizen',
      neighborhood: 'Downtown Core',
      phone: '+1 (555) 010-1002',
    });

    const citizen2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      passwordHash: citizenHash,
      role: 'citizen',
      neighborhood: 'Greenwood Park',
      phone: '+1 (555) 010-2003',
    });

    const citizen3 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      passwordHash: citizenHash,
      role: 'citizen',
      neighborhood: 'Metro Heights',
      phone: '+1 (555) 010-3004',
    });

    const citizen4 = await User.create({
      name: 'Ananya Sen',
      email: 'ananya.sen@example.com',
      passwordHash: citizenHash,
      role: 'citizen',
      neighborhood: 'Lakeside District',
      phone: '+1 (555) 010-4005',
    });

    console.log('Seeded Admin and 4 Citizen accounts.');

    // 3. Seed Realistic Civic Issues
    const baseCoords = { lat: 17.4435, lng: 78.3772 }; // Metro Tech / Central Hub coordinates

    const issuesData = [
      {
        referenceId: 'CC-849102',
        title: 'Severe Garbage Accumulation Behind Sector 4 Market',
        description:
          'Commercial waste, food scraps, and plastic packaging have been overflowing from the public bins for over five days. Stray animals are scattering litter across the footpath, causing foul odor and health concerns for shoppers and nearby vendors.',
        category: 'Garbage & Sanitation',
        severity: 'High',
        status: 'In Progress',
        images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'],
        location: 'Behind Sector 4 Weekly Farmers Market, 5th Main Rd',
        neighborhood: 'Downtown Core',
        latitude: baseCoords.lat + 0.005,
        longitude: baseCoords.lng + 0.003,
        reporter: citizen1._id,
        assignedDepartment: deptMap['Sanitation Department'],
        supporters: [citizen2._id, citizen3._id, citizen4._id],
        supportCount: 3,
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen1._id,
            changedByName: citizen1.name,
            timestamp: new Date(Date.now() - 4 * 86400000),
            notes: 'Citizen lodged initial waste pile complaint with photographic evidence.',
          },
          {
            status: 'Acknowledged',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 3 * 86400000),
            notes: 'Assigned complaint to Sanitation Fleet Team 4 for scheduled clearance.',
          },
          {
            status: 'In Progress',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 1 * 86400000),
            notes: 'Compactor truck dispatched; secondary collection underway.',
          },
        ],
      },
      {
        referenceId: 'CC-921405',
        title: 'Deep Hazardous Pothole Near St. Jude School Gate',
        description:
          'A cavernous pothole measuring nearly 3 feet across and 6 inches deep has formed right outside the school main gate. School buses and two-wheelers are repeatedly bottoming out, creating extreme danger for students during morning drop-off.',
        category: 'Road Damage & Potholes',
        severity: 'Critical',
        status: 'Acknowledged',
        images: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'],
        location: 'Opposite Gate 2, St. Jude Higher Secondary School, Pine Boulevard',
        neighborhood: 'Greenwood Park',
        latitude: baseCoords.lat - 0.007,
        longitude: baseCoords.lng + 0.008,
        reporter: citizen2._id,
        assignedDepartment: deptMap['Roads & Public Works'],
        supporters: [citizen1._id, citizen3._id],
        supportCount: 2,
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen2._id,
            changedByName: citizen2.name,
            timestamp: new Date(Date.now() - 2 * 86400000),
            notes: 'Issue reported with severity marked Critical due to student pedestrian zone.',
          },
          {
            status: 'Acknowledged',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 1 * 86400000),
            notes: 'Public Works inspection team dispatched to barricade area and order cold mix asphalt patch.',
          },
        ],
      },
      {
        referenceId: 'CC-473918',
        title: 'Cluster of Four Non-Functioning Streetlights on Hilltop Road',
        description:
          'Four consecutive LED streetlights along the curved descent of Hilltop Road have been completely dark for over a week. The road lacks pedestrian walkways, making it pitch black and unsafe for women and evening joggers.',
        category: 'Streetlights',
        severity: 'Medium',
        status: 'Resolved',
        images: ['https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80'],
        location: 'Hilltop Road between Lampposts #42 and #46',
        neighborhood: 'Metro Heights',
        latitude: baseCoords.lat + 0.012,
        longitude: baseCoords.lng - 0.009,
        reporter: citizen3._id,
        assignedDepartment: deptMap['Electrical Department'],
        supporters: [citizen1._id, citizen2._id, citizen4._id],
        supportCount: 3,
        resolutionNotes: 'Short circuit in branch feeder cable repaired. Replaced 4 burnt LED driver assemblies.',
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen3._id,
            changedByName: citizen3.name,
            timestamp: new Date(Date.now() - 7 * 86400000),
            notes: 'Citizen reported dark stretch of road.',
          },
          {
            status: 'Acknowledged',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 6 * 86400000),
            notes: 'Assigned to Electrical Department maintenance circuit crew.',
          },
          {
            status: 'In Progress',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 4 * 86400000),
            notes: 'Hydraulic lift vehicle dispatched to inspect overhead wiring.',
          },
          {
            status: 'Resolved',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 2 * 86400000),
            notes: 'Drivers replaced and circuits tested at 230V. Fully operational.',
          },
        ],
      },
      {
        referenceId: 'CC-630291',
        title: 'High-Pressure Clean Drinking Water Pipeline Rupture',
        description:
          'A clean water supply distribution pipe has fractured beneath the road pavers, causing thousands of gallons of potable water to gush onto the street. Local residential taps are losing pressure while the road is flooding.',
        category: 'Water Leakage',
        severity: 'Critical',
        status: 'In Progress',
        images: ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'],
        location: 'Corner of Maple Street and 3rd Cross Road',
        neighborhood: 'Lakeside District',
        latitude: baseCoords.lat - 0.015,
        longitude: baseCoords.lng - 0.011,
        reporter: citizen4._id,
        assignedDepartment: deptMap['Water Board'],
        supporters: [citizen1._id, citizen2._id],
        supportCount: 2,
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen4._id,
            changedByName: citizen4.name,
            timestamp: new Date(Date.now() - 1 * 86400000),
            notes: 'Urgent emergency water main fracture reported by residents.',
          },
          {
            status: 'Acknowledged',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 18 * 3600000),
            notes: 'Isolation valve turned off to halt water wastage; emergency excavation crew mobilized.',
          },
          {
            status: 'In Progress',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 6 * 3600000),
            notes: 'Excavation complete. Replacement ductile iron pipe segment being welded.',
          },
        ],
      },
      {
        referenceId: 'CC-315872',
        title: 'Open Manhole and Uncovered Stormwater Drain',
        description:
          'A heavy concrete manhole cover broke during recent construction and has left an open 4-foot deep stormwater shaft exposed on the pedestrian pavement. No warning cones or caution tape are present.',
        category: 'Drainage & Sewage',
        severity: 'Critical',
        status: 'Reported',
        images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'],
        location: 'Pedestrian Footpath, Westend Ring Road near Metro Pillar 114',
        neighborhood: 'Downtown Core',
        latitude: baseCoords.lat + 0.002,
        longitude: baseCoords.lng - 0.005,
        reporter: citizen1._id,
        assignedDepartment: deptMap['Drainage & Sewerage Department'],
        supporters: [citizen2._id, citizen3._id, citizen4._id],
        supportCount: 3,
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen1._id,
            changedByName: citizen1.name,
            timestamp: new Date(Date.now() - 10 * 3600000),
            notes: 'Citizen submitted hazard alert with live coordinates.',
          },
        ],
      },
      {
        referenceId: 'CC-582914',
        title: 'Damaged Public Bus Shelter with Collapsed Corrugated Roof',
        description:
          'High winds caused half of the corrugated aluminum roof on the city bus transit shelter to collapse downward. Sharp edges hang low, preventing commuters from seeking shelter during rain and posing an injury hazard.',
        category: 'Public Infrastructure',
        severity: 'Medium',
        status: 'Reported',
        images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'],
        location: 'Central Avenue Transit Bay 3, opposite City Library',
        neighborhood: 'Metro Heights',
        latitude: baseCoords.lat - 0.003,
        longitude: baseCoords.lng + 0.015,
        reporter: citizen3._id,
        assignedDepartment: deptMap['Public Infrastructure Department'],
        supporters: [citizen1._id],
        supportCount: 1,
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen3._id,
            changedByName: citizen3.name,
            timestamp: new Date(Date.now() - 16 * 3600000),
            notes: 'Reported bus shelter roof failure.',
          },
        ],
      },
      {
        referenceId: 'CC-719342',
        title: 'Overflowing Sewage Drain Causing Roadside Stagnant Pool',
        description:
          'Blocked sewage lines are backflowing through the drainage grate, creating a foul-smelling blackwater puddle that spans half the carriage road. Mosquito breeding is worsening in the residential area.',
        category: 'Drainage & Sewage',
        severity: 'High',
        status: 'In Progress',
        images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'],
        location: '7th Avenue Junction, Behind Sunrise Apartments',
        neighborhood: 'Greenwood Park',
        latitude: baseCoords.lat + 0.008,
        longitude: baseCoords.lng + 0.011,
        reporter: citizen2._id,
        assignedDepartment: deptMap['Drainage & Sewerage Department'],
        supporters: [citizen3._id, citizen4._id],
        supportCount: 2,
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen2._id,
            changedByName: citizen2.name,
            timestamp: new Date(Date.now() - 3 * 86400000),
            notes: 'Resident logged overflow complaint.',
          },
          {
            status: 'Acknowledged',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 2 * 86400000),
            notes: 'Assigned to Drainage quick-response team.',
          },
          {
            status: 'In Progress',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 1 * 86400000),
            notes: 'High-pressure jetting machine dispatched to clear underground silt blockage.',
          },
        ],
      },
      {
        referenceId: 'CC-149830',
        title: 'Faded and Damaged Pedestrian Zebra Crossing Outside Hospital',
        description:
          'The pedestrian crosswalk paint in front of General Memorial Hospital has completely eroded due to monsoonal wear. Ambulances and speeding vehicles fail to stop for patients crossing the road.',
        category: 'Public Infrastructure',
        severity: 'Medium',
        status: 'Resolved',
        images: ['https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80'],
        location: 'Hospital Main Entrance, Care Hospital Road',
        neighborhood: 'Downtown Core',
        latitude: baseCoords.lat - 0.009,
        longitude: baseCoords.lng - 0.004,
        reporter: citizen1._id,
        assignedDepartment: deptMap['Roads & Public Works'],
        supporters: [citizen2._id, citizen3._id, citizen4._id],
        supportCount: 3,
        resolutionNotes: 'High-visibility thermoplastic white reflective crosswalk lines repainted with pedestrian warning signboards.',
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen1._id,
            changedByName: citizen1.name,
            timestamp: new Date(Date.now() - 8 * 86400000),
            notes: 'Reported hospital crosswalk safety hazard.',
          },
          {
            status: 'Acknowledged',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 7 * 86400000),
            notes: 'Approved for night-shift road marking team.',
          },
          {
            status: 'Resolved',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 3 * 86400000),
            notes: 'Thermoplastic application completed and verified.',
          },
        ],
      },
      {
        referenceId: 'CC-204918',
        title: 'Broken Park Bench with Exposed Rusted Nails',
        description:
          'Children playing in the public community park are at risk due to two collapsed wooden benches with protruding rusted iron fasteners and jagged splintered edges.',
        category: 'Public Infrastructure',
        severity: 'Low',
        status: 'Acknowledged',
        images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'],
        location: 'Rose Garden Park, North Lawn',
        neighborhood: 'Lakeside District',
        latitude: baseCoords.lat - 0.011,
        longitude: baseCoords.lng + 0.005,
        reporter: citizen4._id,
        assignedDepartment: deptMap['Public Infrastructure Department'],
        supporters: [citizen1._id],
        supportCount: 1,
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen4._id,
            changedByName: citizen4.name,
            timestamp: new Date(Date.now() - 2 * 86400000),
            notes: 'Logged park safety issue.',
          },
          {
            status: 'Acknowledged',
            changedBy: adminUser._id,
            changedByName: adminUser.name,
            timestamp: new Date(Date.now() - 1 * 86400000),
            notes: 'Park maintenance team scheduled for bench replacement.',
          },
        ],
      },
      {
        referenceId: 'CC-958210',
        title: 'Illegal Commercial Debris Dumped on Wetland Buffer Zone',
        description:
          'Multiple truckloads of concrete rubble and tile debris were dumped overnight along the protected wetland buffer zone, obstructing bird nesting areas and drainage inlet.',
        category: 'Garbage & Sanitation',
        severity: 'High',
        status: 'Reported',
        images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'],
        location: 'East Wetland Perimeter Rd, Gate 4',
        neighborhood: 'Lakeside District',
        latitude: baseCoords.lat - 0.014,
        longitude: baseCoords.lng + 0.013,
        reporter: citizen4._id,
        assignedDepartment: deptMap['Sanitation Department'],
        supporters: [citizen2._id, citizen3._id],
        supportCount: 2,
        statusHistory: [
          {
            status: 'Reported',
            changedBy: citizen4._id,
            changedByName: citizen4.name,
            timestamp: new Date(Date.now() - 8 * 3600000),
            notes: 'Wetland dumping reported.',
          },
        ],
      },
    ];

    const issues = await Issue.insertMany(issuesData);
    console.log(`Seeded ${issues.length} realistic civic issues.`);

    // 4. Seed Comments
    const commentsData = [
      {
        issue: issues[0]._id, // Market Garbage
        author: citizen2._id,
        content: 'I live nearby and the odor is terrible in the evenings. Really hope the sanitation compactor comes today!',
      },
      {
        issue: issues[0]._id,
        author: adminUser._id,
        content: 'Update from Sanitation Dept: Compactor truck CC-12 is currently in Sector 4 and clearing the site.',
      },
      {
        issue: issues[1]._id, // St. Jude Pothole
        author: citizen1._id,
        content: 'I saw a scooter slide here yesterday when it rained. Highly critical that this gets patched quickly!',
      },
      {
        issue: issues[1]._id,
        author: citizen3._id,
        content: 'Added my support. The school buses have to swerve into oncoming traffic to avoid this hole.',
      },
      {
        issue: issues[2]._id, // Streetlights
        author: citizen2._id,
        content: 'Can confirm lights are working now! Thank you for the quick resolution, it feels much safer to walk.',
      },
      {
        issue: issues[3]._id, // Water Leak
        author: citizen1._id,
        content: 'Water pressure in Block C has completely dropped. Glad to see the repair team already digging.',
      },
    ];

    const comments = await Comment.insertMany(commentsData);
    console.log(`Seeded ${comments.length} community comments.`);

    // Update commentsCount on issues
    for (const issue of issues) {
      const count = await Comment.countDocuments({ issue: issue._id });
      issue.commentsCount = count;
      await issue.save();
    }

    console.log('==================================================');
    console.log(' CivicConnect Database Successfully Seeded!');
    console.log(' Admin Account   : admin@civicconnect.org / Admin@Civic2025!');
    console.log(' Citizen Account : aarav.sharma@example.com / Citizen@123456');
    console.log(' Issues Seeded   : 10 reports across 5 categories');
    console.log('==================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
