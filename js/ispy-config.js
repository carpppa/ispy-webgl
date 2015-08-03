
var ispy = ispy || {};
ispy.version = "0.9.3";

ispy.web_files = [
  "./data/4lepton.ig",
  "./data/Mu.ig",
  "./data/Electron.ig"
];

ispy.groups = {
  Detector: {
    name: "Detector",
    description: ""
  },
  Imported: {
    name: "Imported",
    description: ""
  },
  Provenance: {
    name: "Provenance",
    description: ""
  },
  Tracking: {
    name: "Tracking",
    description: ""
  },
  ECAL: {
    name: "ECAL",
    description: ""
  },
  HCAL: {
    name: "HCAL",
    description: ""
  },
  Muon: {
    name: "Muon",
    description: ""
  },
  Physics: {
    name: "Physics",
    description: ""
  }
};

// TODO: descriptions

ispy.detector = {"Collections":{}};

ispy.POINT = 0;
ispy.LINE = 1;
ispy.BOX = 2;
ispy.SOLIDBOX = 3;
ispy.SCALEDBOX = 4;
ispy.SCALEDSOLIDBOX = 5;
ispy.MODEL = 6;
ispy.TRACK = 7;
ispy.POLYLINE = 8;
ispy.SHAPE = 9;
ispy.TEXT = 10;



// Hmmm, IIRC objects are unordered. However, at least Chrome and Firefox fetch things in
// the reverse order than specified here. Therefore e.g. Tracker appears at the top of
// row of the tree view and CSC at the bottom. Which is what we want.

ispy.detector_description = {
  "RPCMinusEndcap3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Resistive Plate Chambers (-)",
    fn: "makeRPC", style: {color: [0.6, 0.8, 0], opacity: 0.5, linewidth: 1}},
  "RPCPlusEndcap3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Resistive Plate Chambers (+)",
    fn: "makeRPC", style: {color: [0.6, 0.8, 0], opacity: 0.5, linewidth: 1}},
  "RPCBarrel3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Resistive Plate Chambers (barrel)",
    fn: "makeRPC", style: {color: [0.6, 0.8, 0], opacity: 0.5, linewidth: 1}},
  "CSC3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Cathode Strip Chambers",
    fn: "makeCSC", style: {color: [0.6, 0.7, 0.1], opacity: 0.5, linewidth: 1}},
  "DTs3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Drift Tubes",
    fn: "makeDT", style: {color: [0.8, 0.4, 0], opacity: 0.5, linewidth: 1}},

  "HcalForwardMinus3D_MODEL": {type: ispy.MODEL, on: false, group: ispy.groups.Detector, name: "HCAL Forward (-)",
    fn: "makeModelHcalForwardMinus", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},
  "HcalForwardPlus3D_MODEL": {type: ispy.MODEL, on: false, group: ispy.groups.Detector, name: "HCAL Forward (+)",
    fn: "makeModelHcalForwardPlus", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},
  "HcalForwardMinus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "HCAL Forward (-)",
    fn: "makeHcal", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},
  "HcalForwardPlus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "HCAL Forward (+)",
    fn: "makeHcal", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},

  "HcalOuter3D_MODEL": {type: ispy.MODEL, on: true, group: ispy.groups.Detector, name: "HCAL Outer",
    fn: "makeModelHcalOuter", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},
  "HcalOuter3D_V1": {type: ispy.BOX, on: true, group: ispy.groups.Detector, name: "HCAL Outer",
    fn: "makeHcal", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},

  "HcalEndcap3D_MODEL": {type: ispy.MODEL, on: false, group: ispy.groups.Detector, name: "HCAL Endcaps",
    fn: "makeModelHcalEndcap", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},
  "HcalEndcapMinus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "HCAL Endcap (-)",
    fn: "makeHcal", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},
  "HcalEndcapPlus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "HCAL Endcap (+)",
    fn: "makeHcal", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},

  "HcalBarrel3D_MODEL": {type: ispy.MODEL, on: false, group: ispy.groups.Detector, name: "HCAL Barrel",
    fn: "makeModelHcalBarrel", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},
  "HcalBarrel3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "HCAL Barrel",
    fn: "makeHcal", style: {color: [0.7, 0.7, 0], opacity: 0.5, linewidth: 1}},

  "EcalEndcapMinus3D_MODEL": {type: ispy.MODEL, on: false, group: ispy.groups.Detector, name: "ECAL Endcap (-)",
    fn: "makeModelEcalEndcapMinus", style: {color: [0.5, 0.8, 1], opacity: 0.3, linewidth: 0.5}},
  "EcalEndcapPlus3D_MODEL": {type: ispy.MODEL, on: false, group: ispy.groups.Detector, name: "ECAL Endcap (+)",
    fn: "makeModelEcalEndcapPlus", style: {color: [0.5, 0.8, 1], opacity: 0.3, linewidth: 0.5}},
  "EcalBarrel3D_MODEL": {type: ispy.MODEL, on: false, group: ispy.groups.Detector, name: "ECAL Barrel", // Don't load ECAL by default while developing..
    fn: "makeModelEcalBarrel", style: {color: [0.5, 0.8, 1], opacity: 0.3, linewidth: 0.5}},

  "EcalEndcapMinus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "ECAL Endcap (-)",
    fn: "makeEcal", style: {color: [0.5, 0.8, 1], opacity: 0.3, linewidth: 0.5}},
  "EcalEndcapPlus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "ECAL Endcap (+)",
    fn: "makeEcal", style: {color: [0.5, 0.8, 1], opacity: 0.3, linewidth: 0.5}},
  "EcalBarrel3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "ECAL Barrel", // Don't load ECAL by default while developing..
    fn: "makeEcal", style: {color: [0.5, 0.8, 1], opacity: 0.3, linewidth: 0.5}},

  "TrackerEndcap3D_MODEL": {type: ispy.MODEL, on: false, group: ispy.groups.Detector, name: "Tracker Endcaps",
    fn: "makeModelTrackerEndcap", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},
  "TrackerBarrel3D_MODEL": {type: ispy.MODEL, on: false, group: ispy.groups.Detector, name: "Tracker Barrels",
    fn: "makeModelTrackerBarrel", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},

  "SiStripTECMinus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Tracker Endcap (-)",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},
  "SiStripTECPlus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Tracker Endcap (+)",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},
  "SiStripTIDMinus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Tracker Inner Detector (-)",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},
  "SiStripTIDPlus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Tracker Inner Detector (+)",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},
  "SiStripTOB3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Tracker Outer Barrel",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},
  "SiStripTIB3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Tracker Inner Barrel",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},

  "PixelEndcapMinus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Pixel Endcap (-)",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},
  "PixelEndcapPlus3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Pixel Endcap (+)",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},
  "PixelBarrel3D_V1": {type: ispy.BOX, on: false, group: ispy.groups.Detector, name: "Pixel Barrel",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}}
};

ispy.event_description = {
  "EERecHits_V2": {type: ispy.SCALEDSOLIDBOX, on: true, group: ispy.groups.ECAL, name: "Endcap Rec. Hits",
    fn: "makeRecHit_V2", style: {color: [0.1, 1.0, 0.1], opacity: 0.5, linewidth: 1}, scale: 0.05, min_energy: 0.5},
  "ESRecHits_V2": {type: ispy.SCALEDSOLIDBOX, on: false, group: ispy.groups.ECAL, name: "Preshower Rec. Hits",
    fn: "makeRecHit_V2", style: {color: [1, 0.2, 0], opacity: 0.5, linewidth: 1}, scale: 0.05, min_energy: 0.5},
  "EBRecHits_V2": {type: ispy.SCALEDSOLIDBOX, on: true, group: ispy.groups.ECAL, name: "Barrel Rec. Hits",
    fn: "makeRecHit_V2", style: {color: [0.1, 1.0, 0.1], opacity: 0.5, linewidth: 1}, scale: 0.05, min_energy: 0.5},

  "HFRecHits_V2": {type: ispy.SCALEDSOLIDBOX, on: false, group: ispy.groups.HCAL, name: "Forward Rec. Hits",
    fn: "makeRecHit_V2", style: {color: [0.6, 1, 1], opacity: 0.5, linewidth: 0.5}, scale: 0.1, min_energy: 0.5},
  "HORecHits_V2": {type: ispy.SCALEDSOLIDBOX, on: false, group: ispy.groups.HCAL, name: "Outer Rec. Hits",
    fn: "makeRecHit_V2", style: {color: [0.2, 0.7, 1], opacity: 0.5, linewidth: 0.5}, scale: 0.1, min_energy: 0.5},
  "HERecHits_V2": {type: ispy.SCALEDSOLIDBOX, on: true, group: ispy.groups.HCAL, name: "Endcap Rec. Hits",
    fn: "makeRecHit_V2", style: {color: [0.2, 0.7, 1], opacity: 0.5, linewidth: 0.5}, scale: 0.1, min_energy: 0.5},
  "HBRecHits_V2": {type: ispy.SCALEDSOLIDBOX, on: true, group: ispy.groups.HCAL, name: "Barrel Rec. Hits",
    fn: "makeRecHit_V2", style: {color: [0.2, 0.7, 1], opacity: 0.5, linewidth: 0.5}, scale: 0.1, min_energy: 0.5},

  "Tracks_V1": {type: ispy.TRACK, on: true, group: ispy.groups.Tracking, name: "Tracks (reco.)",
    extra: "Extras_V1", assoc: "TrackExtras_V1",
    fn: "makeTracks", style: {color: [1, 0.7, 0.1], opacity: 0.7, lineCaps: "square", linewidth: 3}, min_pt: 1.},
  "Tracks_V2": {type: ispy.TRACK, on: true, group: ispy.groups.Tracking, name: "Tracks (reco.)",
    extra: "Extras_V1", assoc: "TrackExtras_V1",
    fn: "makeTracks", style: {color: [1, 0.7, 0.1], opacity: 0.7, lineCaps: "square", linewidth: 3}, min_pt: 1.},
  "Tracks_V3": {type: ispy.TRACK, on: true, group: ispy.groups.Tracking, name: "Tracks (reco.)",
    extra: "Extras_V1", assoc: "TrackExtras_V1",
    fn: "makeTracks", style: {color: [1, 0.7, 0.1], opacity: 0.7, lineCaps: "square", linewidth: 3}, min_pt: 1.},

  "TrackDets_V1": {type: ispy.BOX, on: false, group: ispy.groups.Tracking, name: "Matching Tracker Dets",
    fn: "makeTrackerPiece", style: {color: [1, 1, 0], opacity: 0.5, linewidth: 1}},
  "TrackingRecHits_V1": {type:ispy.POINT, on:false, group: ispy.groups.Tracking, name: "Tracking Rec Hits",
    fn: "makeTrackingRecHits", style: {color: [1, 1, 0], size: 0.05}},
  "SiStripClusters_V1": {type: ispy.POINT, on:false, group: ispy.groups.Tracking, name: "Si Strip Clusters",
    fn: "makeTrackingClusters", style:{color: [0.8, 0.2, 0.0], size: 0.05}},
  "SiPixelClusters_V1": {type: ispy.POINT, on:false, group: ispy.groups.Tracking, name: "Si Pixel Clusters",
    fn: "makeTrackingClusters", style:{color: [1.0, 0.4, 0.0], size: 0.05}},

  "Event_V1":{type: ispy.TEXT, on: true, group: ispy.groups.Provenance, name: "Event", fn: "makeEvent"},
  "Event_V2":{type: ispy.TEXT, on: true, group: ispy.groups.Provenance, name: "Event", fn: "makeEvent"},

  "DTRecHits_V1": {type: ispy.SOLIDBOX, on: false, group: ispy.groups.Muon, name: "DT Rec. Hits",
    fn: "makeDTRecHits", style: {color: [0, 1, 0], opacity: 0.5, linewidth: 2}},

  "DTRecSegment4D_V1": {type: ispy.LINE, on: true, group: ispy.groups.Muon, name: "DT Rec. Segments (4D)",
    fn: "makeDTRecSegments", style: {color: [1, 1, 0, 1], opacity: 1.0, linewidth: 3}},

  "RPCRecHits_V1": {type: ispy.LINE, on: true, group: ispy.groups.Muon, name: "RPC Rec. Hits",
    fn: "makeRPCRecHits", style: {color: [0.8, 1, 0, 1], opacity: 1.0, linewidth: 3}},

  "CSCStripDigis_V1": {type: ispy.SOLIDBOX, on: false, group: ispy.groups.Muon, name: "CSC Strip Digis",
    fn: "makeCSCStripDigis", style: {color: [1.0, 0.2, 1.0], opacity: 0.5, linewidth: 1}},
  "CSCWireDigis_V1": {type: ispy.SOLIDBOX, on: false, group: ispy.groups.Muon, name: "CSC Wire Digis",
    fn: "makeCSCWireDigis", style: {color: [1.0, 0.6, 1.0], opacity: 0.5, linewidth: 1}},

  /* this only exists in my test file
   "MatchingCSCs_V1": {type: ispy.BOX, on: true, group: ispy.groups.Muon, name: "Matching CSCs",
   fn: "makeMuonChamber", style: {color: [1, 0, 0], opacity: 0.3, linewidth: 2}},
   */

  "CSCRecHit2Ds_V2": {type: ispy.LINE, on: true, group: ispy.groups.Muon, name: "CSC Rec. Hits (2D)",
    fn: "makeCSCRecHit2Ds_V2", style: {color: [0.6, 1, 0.9, 1], opacity: 1.0, linewidth: 2}},
  "CSCSegments_V1": {type: ispy.LINE, on: true, group: ispy.groups.Muon, name: "CSC Segments",
    fn: "makeCSCSegments", style: {color: [1, 0.6, 1, 1], opacity: 1.0, linewidth: 3}},
  "CSCSegments_V2": {type: ispy.LINE, on: true, group: ispy.groups.Muon, name: "CSC Segments",
    fn: "makeCSCSegments", style: {color: [1, 0.6, 1, 1], opacity: 1.0, linewidth: 3}},
  "CSCSegments_V3": {type: ispy.LINE, on: true, group: ispy.groups.Muon, name: "CSC Segments",
    fn: "makeCSCSegments", style: {color: [1, 0.6, 1, 1], opacity: 1.0, linewidth: 3}},

  "MuonChambers_V1": {type: ispy.BOX, on: true, group: ispy.groups.Muon, name: "Matching muon chambers",
    fn: "makeMuonChamber", style: {color: [1, 0, 0], opacity: 0.5, linewidth: 1}},

  "METs_V1": {type: ispy.SHAPE, on: false, group: ispy.groups.Physics, name: "Missing Et (Reco)",
    fn: "makeMET", style: {color: [1, 1, 0], opacity: 1.0}},
  "Jets_V1": {type: ispy.SHAPE, on: false, group: ispy.groups.Physics, name: "Jets",
    fn: "makeJet", style: {color: [1, 1, 0], opacity: 0.3}},
  "Photons_V1": {type: ispy.LINE, on: false, group: ispy.groups.Physics, name: "Photons (Reco)",
    fn: "makePhoton", style: {color: [0.8, 0.8, 0], opacity: 1.0, linewidth: 2}},

  "GlobalMuons_V1": {type: ispy.POLYLINE, on: true, group: ispy.groups.Physics, name: "Global Muons (Reco)",
    extra: "Points_V1", assoc: "MuonGlobalPoints_V1",
    fn: "makeTrackPoints", style: {color: [1, 0, 0], opacity: 1.0, linewidth: 3}},
  "StandaloneMuons_V1": {type: ispy.POLYLINE, on: false, group: ispy.groups.Physics, name: "Stand-alone Muons (Reco)",
    extra: "Points_V1", assoc: "MuonStandalonePoints_V1",
    fn: "makeTrackPoints", style: {color: [1, 0, 0], opacity: 1.0, linewidth: 3}},
  "StandaloneMuons_V2": {type: ispy.TRACK, on: false, group: ispy.groups.Physics, name: "Stand-alone Muons (Reco)",
    extra: "Extras_V1", assoc: "MuonTrackExtras_V1",
    fn: "makeTracks", style: {color: [1, 0, 0], opacity: 1.0, linewidth: 3}},
  "TrackerMuons_V1": {type: ispy.POLYLINE, on: true, group: ispy.groups.Physics, name: "Tracker Muons (Reco)",
    extra: "Points_V1", assoc: "MuonTrackerPoints_V1",
    fn: "makeTrackPoints", style: {color: [1, 0, 0], opacity: 1.0, linewidth: 3}},

  "GsfElectrons_V1": {type: ispy.TRACK, on: true, group: ispy.groups.Physics, name: "Electron Tracks (GSF)",
    extra: "Extras_V1", assoc: "GsfElectronExtras_V1",
    fn: "makeTracks", style: {color: [0.1, 1.0, 0.1], opacity: 0.9, linewidth: 3}, min_pt: 1},
  "GsfElectrons_V2": {type: ispy.TRACK, on: true, group: ispy.groups.Physics, name: "Electron Tracks (GSF)",
    extra: "Extras_V1", assoc: "GsfElectronExtras_V1",
    fn: "makeTracks", style: {color: [0.1, 1.0, 0.1], opacity: 0.9, linewidth: 3}}
};

ispy.disabled = [];

for (var key in ispy.detector_description) {
  if ( ! ispy.detector_description[key].on ) {
    ispy.disabled[key] = true;
  }
}

for (var key in ispy.event_description) {
  if ( ! ispy.event_description[key].on ) {
    ispy.disabled[key] = true;
  }
}

ispy.table_caption = '<caption>Click on a name under "Provenance", "Tracking", "ECAL", "HCAL", "Muon", and "Physics" to view contents in table</caption>';
