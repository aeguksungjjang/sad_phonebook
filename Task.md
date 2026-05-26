# Task.md: Sad Phonebook 구현 체크리스트

PRD 기준 구현 현황 및 남은 작업 목록.

---

## 범례
- [x] 완료
- [ ] 미완료

---

## Phase 1 — 프로젝트 초기 설정

- [x] **T-01** Next.js 프로젝트 생성 (`pages` Router)
- [x] **T-02** `@supabase/supabase-js` 패키지 설치
- [x] **T-03** `.env.local.example` 작성 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [x] **T-04** Supabase 클라이언트 싱글턴 생성 (`lib/supabaseClient.js`)
- [ ] **T-05** `.env.local`에 실제 Supabase 프로젝트 URL과 anon key 입력

---

## Phase 2 — Supabase 데이터베이스 설정

- [ ] **T-06** Supabase 대시보드 → SQL Editor에서 `contacts` 테이블 생성

  ```sql
  create table contacts (
    id         uuid primary key default gen_random_uuid(),
    name       text not null,
    phone      text not null,
    created_at timestamptz default now()
  );
  ```

- [ ] **T-07** Supabase 대시보드 → Authentication → Policies에서 `contacts` 테이블 RLS(Row Level Security) 비활성화 또는 전체 허용 정책 추가
  - 로그인이 없으므로 `anon` 역할에 SELECT / INSERT / UPDATE / DELETE 모두 허용

---

## Phase 3 — 프론트엔드 구현

- [x] **T-08** 연락처 목록 조회 (`fetchContacts` — `created_at` 내림차순)
- [x] **T-09** 연락처 추가 폼 (이름·전화번호 필수, 로딩 상태, 오류 메시지)
- [x] **T-10** 연락처 인라인 수정 (수정 버튼 → 편집 모드 전환 → 저장/취소)
- [x] **T-11** 연락처 삭제 (confirm 다이얼로그 → DELETE)
- [x] **T-12** 빈 목록 안내 문구 표시
- [x] **T-13** 전체 CSS 스타일 (`styles/globals.css`)

---

## Phase 4 — 로컬 검증

- [ ] **T-14** `npm run dev` 실행 후 브라우저에서 동작 확인
  - [ ] 연락처 추가 → 목록 즉시 갱신
  - [ ] 수정 버튼 → 인라인 편집 → 저장 후 반영
  - [ ] 삭제 버튼 → confirm → 목록에서 제거
- [ ] **T-15** Supabase 대시보드 Table Editor에서 데이터 실제 반영 여부 확인

---

## Phase 5 — Vercel 배포

- [ ] **T-16** GitHub 리포지토리에 현재 코드 push
- [ ] **T-17** Vercel 대시보드에서 GitHub 리포지토리 import
- [ ] **T-18** Vercel 프로젝트 설정 → Environment Variables에 두 값 추가
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **T-19** Vercel 배포 완료 후 발급된 URL에서 전체 기능 재검증

---

## 현재 상태 요약

| 항목 | 상태 |
|------|------|
| 코드 구현 (CRUD) | **완료** |
| Supabase 테이블 생성 | **미완료** |
| 환경변수 실제 값 입력 | **미완료** |
| 로컬 동작 확인 | **미완료** |
| Vercel 배포 | **미완료** |

> **다음 액션:** T-05 → T-06 → T-07 순서로 진행하면 로컬에서 즉시 실행 가능.
