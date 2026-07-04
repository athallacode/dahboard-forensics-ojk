// ============================================
// LPBTI OJK Dashboard — TypeScript Interfaces
// ============================================

export type UserRole = 'staf_pemeriksa' | 'supervisor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  division: string;
  avatar?: string;
}

export type RequestStatus = 'completed' | 'on_progress' | 'pending' | 'rejected';

export interface ExaminationRequest {
  id: string;
  requestNo: string;
  useCase: string;
  description: string;
  requestDate: string;
  status: RequestStatus;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  createdBy: string;
  division: string;
  updatedAt: string;
}

export interface EvidenceFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  requestId: string;
  requestNo: string;
  status: 'verified' | 'pending_review' | 'rejected';
  version: number;
  checksum: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  priority: 'urgent' | 'normal';
  isRead: boolean;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface DashboardStats {
  totalTasks: number;
  inProgress: number;
  completed: number;
  pending: number;
}

export interface Report {
  id: string;
  title: string;
  type: 'pemeriksaan' | 'evidence' | 'summary' | 'audit';
  generatedBy: string;
  generatedAt: string;
  period: string;
  status: 'ready' | 'generating' | 'failed';
  fileSize: string;
}
