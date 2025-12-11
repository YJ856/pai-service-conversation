/**
 * User API Port
 * 가족 프로필 정보 제공하는 외부 API 인터페이스
 */

export interface ParentProfileSummary {
  profileId: number;
  name: string;
  avatarMediaId: bigint | null;
}

export interface ChildProfileSummary {
  profileId: number;
  name: string;
  avatarMediaId: bigint | null;
}

export interface FamilyProfileSummary {
  parents: ParentProfileSummary[];
  children: ChildProfileSummary[];
}

export interface UserApiPort {
  getFamilyProfileWithScopeChildren(): Promise<{
    children: ChildProfileSummary[];
  }>;
}
