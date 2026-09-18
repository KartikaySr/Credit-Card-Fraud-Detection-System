'use client';
import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// Generating deterministic synthetic graph data
const generateGraphData = () => {
  const nodes = [];
  const links = [];
  
  // Center fraud node
  nodes.push({ id: 'F1', group: 1, val: 5, label: 'Compromised Node (Root)' });
  
  // 1st degree connections
  for (let i = 1; i <= 5; i++) {
    nodes.push({ id: `A${i}`, group: 2, val: 3, label: `Merchant ${i}` });
    links.push({ source: 'F1', target: `A${i}` });
  }
  
  // 2nd degree micro-transactions
  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 3; j++) {
      nodes.push({ id: `B${i}-${j}`, group: 3, val: 1, label: `Stolen Card ${i}-${j}` });
      links.push({ source: `A${i}`, target: `B${i}-${j}` });
    }
  }

  // Add some cross-links to make it look like a ring
  links.push({ source: 'B1-1', target: 'B2-2' });
  links.push({ source: 'B3-1', target: 'B4-3' });
  links.push({ source: 'A1', target: 'A5' });

  return { nodes, links };
};

export default function ForceGraph() {
  const fgRef = useRef<any>();
  const [data] = useState(generateGraphData());

  useEffect(() => {
    // Make graph fit to container and gently rotate
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-120);
    }
  }, []);

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      nodeLabel="label"
      nodeColor={(node: any) => {
        if (node.group === 1) return '#f43f5e'; // rose-500 (Fraud)
        if (node.group === 2) return '#34d399'; // emerald-400 (Merchant)
        return '#22d3ee'; // cyan-400 (Cards)
      }}
      nodeRelSize={4}
      linkColor={() => 'rgba(255,255,255,0.2)'}
      backgroundColor="#00000000"
      width={typeof window !== 'undefined' ? (window.innerWidth > 1024 ? 600 : 350) : 600}
      height={400}
      onNodeClick={(node: any) => {
        // Center/zoom on node
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(2, 2000);
      }}
    />
  );
}
