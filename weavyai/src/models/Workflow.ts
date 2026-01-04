import mongoose, { Schema, Document, Model } from "mongoose";

// 1. TypeScript Interface
export interface IWorkflow extends Document {
  name: string;
  userId: string;       // References the Clerk ID (clerkId from User model)
  nodes: any[];         // React Flow Nodes
  edges: any[];         // React Flow Edges
  viewport: {           // Saved camera position
    x: number; 
    y: number; 
    zoom: number 
  };
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
const WorkflowSchema = new Schema<IWorkflow>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    userId: { 
      type: String, 
      required: true,
      index: true // Crucial for fetching "My Workflows" quickly
    },
    // We use "Mixed" type because React Flow nodes contain complex, nested JSON
    nodes: { 
      type: Schema.Types.Mixed, 
      default: [] 
    },
    edges: { 
      type: Schema.Types.Mixed, 
      default: [] 
    },
    viewport: {
      type: Schema.Types.Mixed,
      default: { x: 0, y: 0, zoom: 1 }
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

// 3. Next.js Hot Reload Fix
const Workflow: Model<IWorkflow> = mongoose.models.Workflow || mongoose.model<IWorkflow>("Workflow", WorkflowSchema);

export default Workflow;

