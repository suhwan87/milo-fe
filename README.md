## 📚 목차

- [🧠 프로젝트 소개](#-마음을-기억하는-챗봇-Milo)
- [👀 서비스 소개](#-서비스-소개)
- [📅 프로젝트 기간](#-프로젝트-기간)
- [📎 GitHub 주소 (Frontend / Backend / AI)](#-github-주소-frontend--backend--ai)
- [⭐ 주요 기능](#-주요-기능)
- [🔁 서비스 동작 구조](#-서비스-동작-구조)
- [⚙ 시스템 아키텍처](#-시스템-아키텍처)
- [📊 ERD 다이어그램](#-erd-다이어그램)
- [🖥 화면 구성 미리보기](#-화면-구성-미리보기)
- [🛠 기술 스택](#-기술-스택)
- [🧼 데이터 전처리 과정](#-데이터-전처리-과정)
- [📂 React 서버 디렉토리 구조](#-React-서버-디렉토리-구조)
- [🛠 설치 및 실행 (React 프론트 서버)](#-설치-및-실행-React-프론트-서버)
- [📌 사용 예시](#-사용-예시)
- [🤯 트러블슈팅 요약](#-트러블슈팅-요약)
- [👨‍👩‍👧‍👦 팀원 역할](#-팀원-역할)
- [📄 라이선스](#-라이선스)

---

# 🧠 마음을 기억하는 챗봇, Milo

> (Agent Tool 기반 AI 정서 케어 챗봇 서비스)

<div align="center">
  <img src="https://github.com/user-attachments/assets/699397f4-0360-4981-9ad1-b683d0a29239" width="400px"/>
  <p><b>시작 화면</b>
</div>

---

## 👀 서비스 소개

- **서비스명**: Milo
- **서비스 설명**:  
  정서 표현이 어려운 사람들을 위한 **AI 기반 정서지원 챗봇 플랫폼**  
  사용자의 감정을 기억하고, 분석하고, 회복 문장과 위로 메시지를 제공합니다.  
  상담형/리허설형 챗봇, 감정 아카이브, 분석 리포트까지 포함된 **개인 맞춤형 감정 도우미**입니다.

---

## 📅 프로젝트 기간

2025.05.14 ~ 2025.07.10 (약 8주)

---

## 📎 GitHub 주소 (Frontend / Backend / AI)

- Frontend : https://github.com/suhwan87/milo-fe <br>
- Backend (Spring) : https://github.com/suhwan87/milo-be <br>
- AI Server (FastAPI) : https://github.com/julle0123/milo-ai

---

## ⭐ 주요 기능

| 구분        | 설명                                                    |
| ----------- | ------------------------------------------------------- |
| 상담 챗봇   | 감정을 분석하고 위로의 말을 건네는 GPT 기반 상담 챗봇   |
| 역할극 챗봇 | 이름/관계/말투/상황을 설정한 감정 리허설 챗봇           |
| 감정 리포트 | 일일/월간 감정 흐름 요약 리포트 생성 및 저장            |
| 회복 문장   | 유사 감정 기반 회복 문장 저장 보관함 구성               |
| 회복 컨텐츠 | 대화 중 사용자의 감정 변동에 따라 감정 회복 컨텐츠 추천 |
| 시각화 기능 | 감정 이모지 캘린더 / 월간 감정 레이더 차트              |
| 위험 감지   | 감정 분석 결과 위기 신호 시 안정 응답 + 기관 연결       |

---

## 🔁 서비스 동작 구조

1. 프론트 → 백엔드(Spring)로 사용자 발화 전송
2. Spring → FastAPI로 사용자 질문/기록 전달
3. FastAPI(GPT Agent) → 감정 분석, 키워드 추출
4. Qdrant로 유사 감정 사례 검색 → GPT가 회복 피드백 생성
5. FastAPI → 감정 리포트 + 회복 문장 추천 응답
6. Spring → DB 저장 후 프론트로 최종 응답 전달
7. 리포트/감정 흐름/회복 문장 시각화에 반영됨

---

## ⚙ 시스템 아키텍처

![Image](https://github.com/user-attachments/assets/fd6b5494-61b9-4d5f-880b-b53722c78ba2)

---

## 📊 ERD 다이어그램

![Image](https://github.com/user-attachments/assets/5bac60fe-1517-4ae1-b945-2fb4a214836b)

---

## 🖥 화면 구성 미리보기

<table>
<tr>
  <td align="center"><img src="https://github.com/user-attachments/assets/870979ed-ebfc-422d-a4d0-31590f179da4" width="200"/><br/>로그인</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/1267be99-cc0c-490e-8cc8-350f0e0b997f" width="200"/><br/>메인 화면</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/8c13527b-d711-47de-944e-1cab9f73b29f" width="200"/><br/>비밀번호 찾기</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/9e59fb33-529d-4cd2-9d9c-09f62f4c4392" width="200"/><br/>아이디 찾기</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/2bae1163-dcc2-4117-9bcc-9c92a0294070" width="200"/><br/>회원가입</td>
</tr>
<tr>
  <td align="center"><img src="https://github.com/user-attachments/assets/131eabc3-1203-475e-9ae5-4fc6e6644509" width="200"/><br/>상담 챗봇</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/208a6a29-181b-48a7-bf38-5922b6440954" width="200"/><br/>하루 감정 리포트</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/4ef059ef-d83c-4dab-8f8e-5139f9ae6921" width="200"/><br/>하루 감정 리포트 달력</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/a181baf0-acf8-4908-b7b3-60290632c7fa" width="200"/><br/>감정 아카이브</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/1865d352-ae86-4296-b340-153552db38aa" width="200"/><br/>상담 스타일 변경</td>
</tr>
<tr>
  <td align="center"><img src="https://github.com/user-attachments/assets/d56c2abf-5a9f-4a9e-9796-a80acfa8a48c" width="200"/><br/>역할 정하기1</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/e7d40ee6-46be-4564-9636-3cfaf4b37a45" width="200"/><br/>역할 정하기2</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/48c8a5b5-54ed-4991-862e-397cf8fc7831" width="200"/><br/>역할 정하기3</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/bd9a1012-7935-43f2-bc81-efc397ccf289" width="200"/><br/>역할 정하기4</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/f204d50c-4c3c-477d-839f-fc79d4e2d8bb" width="200"/><br/>역할 정하기5</td>
</tr>
<tr>
  <td align="center"><img src="https://github.com/user-attachments/assets/c987293d-7871-4d9f-a35e-3a538936464f" width="200"/><br/>역할 챗봇</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/209a2433-00f8-4a27-a192-ab89ce9701d8" width="200"/><br/>회복문장</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/e637d784-c728-4e60-a484-7719377532f4" width="200"/><br/>설정</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/093747ae-02be-417b-bf0a-e9a16db6e221" width="200"/><br/>문의하기</td>
  <td align="center"><img src="https://github.com/user-attachments/assets/a1f8c570-74de-41d8-b9f0-60d2c10993de" width="200"/><br/>회원탈퇴</td>
</tr>
</table>
---

## 🛠 기술 스택

| 구분                   | 사용 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**           | ![](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white) <br> ![](https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) ![](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)                                                                                                                                                                         |
| **Backend**            | ![](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) ![](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![](https://img.shields.io/badge/JPA-007396?style=for-the-badge&logo=hibernate&logoColor=white) ![](https://img.shields.io/badge/SpringSecurity-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) ![](https://img.shields.io/badge/Lombok-EC722E?style=for-the-badge&logo=lombok&logoColor=white) <br>![](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) ![](https://img.shields.io/badge/RESTful_API-000000?style=for-the-badge) ![](https://img.shields.io/badge/CORS_Global-FFB300?style=for-the-badge) ![](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) |
| **AI Server**          | ![](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![](https://img.shields.io/badge/Pydantic-007EC6?style=for-the-badge) ![](https://img.shields.io/badge/SQLAlchemy-FFCA28?style=for-the-badge) ![](https://img.shields.io/badge/Uvicorn-000000?style=for-the-badge)                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **AI & LLM**           | ![](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white) ![](https://img.shields.io/badge/LangChain-000000?style=for-the-badge) ![](https://img.shields.io/badge/AgentTool-0A0A0A?style=for-the-badge) ![](https://img.shields.io/badge/RAG-000000?style=for-the-badge)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Database**           | ![](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![](https://img.shields.io/badge/Qdrant-1A1A1A?style=for-the-badge)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Infra / Deploy**     | ![](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![](https://img.shields.io/badge/NaverCloud-03C75A?style=for-the-badge&logo=naver&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **개발 도구**          | ![](https://img.shields.io/badge/IntelliJ-000000?style=for-the-badge&logo=intellijidea&logoColor=white) ![](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white) ![](https://img.shields.io/badge/Google_Colab-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **기획 / 디자인 도구** | ![](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white) ![](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **협업 도구**          | ![](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

---

## 🧼 데이터 전처리 과정

### 📁 데이터 출처

- AI Hub 감성 대화 말뭉치
- CounselGPT 한국어 심리상담 데이터셋
- 하이닥 심리상담 Q&A 크롤링
- 감정 분류용 라벨 데이터 (기쁨, 슬픔, 분노, 불안, 상처, 당황 등)

---

### 🔍 전처리 단계 요약

| 단계                    | 설명                                           |
| ----------------------- | ---------------------------------------------- |
| 1. 중복 제거            | 동일 문장 또는 유사도 0.95 이상 문장 필터링    |
| 2. 비어 있는 행 제거    | 질문 또는 응답이 누락된 row 제거               |
| 3. 감정 라벨 정제       | 대분류 감정만 추출 (예: "불안\_긴장" → "불안") |
| 4. 텍스트 분리          | 멀티턴 데이터를 싱글턴 데이터로 분리           |
| 5. 특수문자 제거        | `[^ㄱ-ㅎ가-힣a-zA-Z0-9\s]` 패턴으로 클렌징     |
| 6. 분류용 데이터셋 생성 | 감정 분석 학습용 `text`, `label` 컬럼 구성     |

---

### 🧠 전처리한 데이터를 토대로 만든 감정분류 모델(hugging-face)

- https://huggingface.co/Seonghaa/emotion-koelectra
- KCELECTRA 활용
- 만들어진 모델로 데이터 전체 감정분류 적용

---

### 🎯 최종 전처리 샘플

```csv
text,label
"요즘은 너무 지치고 잠도 잘 못 자요.","불안"
"기분이 좋고 뿌듯해요. 다 잘 될 것 같아요.","기쁨"
"그 사람이 또 나를 무시했어. 너무 화가 나.","분노"
```

---

### 🎒 임베딩 후 qdrant 벡터 DB 저장

- openai 3-small-textembedding 모델 활용하여 감정 + 사용자입력 데이터 30만 문장 임베딩
- metadata에 입력에 대한 응답 등을 포함하여 qdrant 벡터 DB에 저장하여 rag에 활용

---

## 📂 React 서버 디렉토리 구조

--> 백엔드와 AI는 다른곳에 기록됨.

```
milo-fe/
├── .github/                              # GitHub Actions 관련 설정
│   └── workflows/
│       └── deploy.yml
├── build/                                # 빌드 결과물
├── nginx/
│   └── default.conf                      # Nginx 설정 파일
├── public/                               # 정적 파일 루트
├── src/
│   ├── assets/                           # 이미지, 아이콘 등 리소스
│   │   ├── characters/
│   │   └── icons/
│   ├── components/                       # 공통 컴포넌트
│   │   ├── AppLayout.jsx
│   │   ├── CalendarToggle.jsx
│   │   ├── CalendarView.jsx
│   │   ├── EmotionArchive.jsx
│   │   ├── EmotionKeyword.jsx
│   │   ├── EmotionRadarChart.jsx
│   │   ├── EmotionSlider.jsx
│   │   ├── EmotionTag.jsx
│   │   ├── FindId.jsx
│   │   ├── FindPassword.jsx
│   │   ├── FolderDetailView.jsx
│   │   ├── Header.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── ReportCard.jsx
│   │   ├── ReportHeader.jsx
│   │   └── SettingsDrawer.jsx
│   ├── config/                           # 설정 유틸
│   │   ├── auth.js                       # 인증 관련 유틸
│   │   ├── axios.js                      # Axios 인스턴스 설정
│   │   └── chartConfig.js                # Chart.js 설정
│   ├── fonts/                            # 커스텀 폰트
│   │   └── TDTDTadakTadak.ttf
│   ├── pages/                            # 주요 화면 구성
│   │   ├── settings/                     # 설정 관련 화면
│   │   │   ├── ChangeNickname.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── ChatStyle.jsx
│   │   │   ├── Inquiry.jsx
│   │   │   ├── Terms.jsx
│   │   │   └── Withdraw.jsx
│   │   ├── ChatBot1.jsx
│   │   ├── ChatBot2.jsx
│   │   ├── EmotionArchivePage.jsx
│   │   ├── EmotionReport.jsx
│   │   ├── Login.jsx
│   │   ├── MainPage.jsx
│   │   ├── MindDrawerPage.jsx
│   │   ├── RolePlay.jsx
│   │   ├── SignUp.jsx
│   │   └── Splash.jsx
│   ├── stores/
│   │   └── useDrawerStore.js
│   ├── styles/                           # 컴포넌트별 CSS
│   │   ├── App.css
│   │   ├── CalendarSection.css
│   │   ├── ChangeNickname.css
│   │   ├── ChangePassword.css
│   │   ├── ChangeStyle.css
│   │   ├── ChatBot.css
│   │   ├── EmotionArchive.css
│   │   ├── EmotionArchivePage.css
│   │   ├── EmotionKeyword.css
│   │   ├── EmotionReport.css
│   │   ├── EmotionSlider.css
│   │   ├── EmotionTag.css
│   │   ├── FindId.css
│   │   ├── FindPassword.css
│   │   ├── FolderDetailView.css
│   │   ├── Header.css
│   │   ├── Inquiry.css
│   │   ├── Login.css
│   │   ├── MindDrawerPage.css
│   │   ├── ReportCard.css
│   │   ├── ReportHeader.css
│   │   ├── RolePlay.css
│   │   ├── SettingsDrawer.css
│   │   ├── SignUp.css
│   │   ├── Splash.css
│   │   ├── Terms.css
│   │   └── Withdraw.css
│   ├── App.js                           # React 진입점
│   ├── index.css
│   └── index.js                         # React DOM 렌더링
├── .dockerignore                        # Docker 배포 무시 파일
├── .eslintrc.json                       # ESLint 설정
├── .gitignore                           # Git 무시 파일
├── .prettierrc                          # Prettier 설정
├── Dockerfile                           # React Docker 배포 설정
├── jsconfig.json                        # 절대 경로 import 설정
├── package-lock.json
├── package.json                         # 프로젝트 의존성 및 스크립트
└── README.md                            # 프로젝트 설명서
```

---

## 🛠 설치 및 실행 (React 프론트 서버)

```VScode
# 1. 의존성 설치
./gradlew build

# 2. 개발 서버 실행 (http://localhost:3000)
npm run start
```

---

## 📌 사용 예시

### 💬 사용자가 Milo에게 입력한 문장

> "요즘 너무 불안하고 잠이 안 와요… 혼자 있는 게 무서워요."

---

### 🧠 1. 감정 분석 결과 (GPT + 벡터 처리)

- 주요 감정: `불안(0.91), 슬픔(0.68)`
- 대표 감정: `불안`

---

### 🔍 2. 유사 감정 사례 검색 (Qdrant + RAG)

> 여러 상담 데이터와 유사한 대화 3건 추출 후 GPT 프롬프트에 포함

---

### 💡 3. GPT 응답 예시

> "당신이 지금 느끼는 불안은 결코 가벼운 것이 아니에요.  
> 누군가에게 기대고 싶다는 감정은 자연스러운 거예요.  
> 너무 혼자 버티려고 하지 마세요. 함께 있어줄게요."

---

### 🗂️ 4. 자동 저장

- 상담 내용 → `chat_log_TB`
- 감정 분석 결과 → `daily_emotion_report_TB`
- GPT 응답 → 회복 문장 추천 또는 저장 유도
- 3일 이상 하루 감정 분석 리포트가 작성 시 감정 아카이브 작성 -> `monthly_emotion_summary_TB`

---

## 🤯 트러블슈팅 요약

| 문제 | 원인 | 해결 |
|------|------|------|
| 대화 종료 후 감정 리포트가 생성되기 전에 조회되어 "리포트 없음"으로 응답됨 | Spring Boot 서버에서 리포트 조회 시점이 FastAPI 생성보다 빨라, 생성이 완료되지 않은 상태의 데이터를 먼저 조회함 | 리포트 생성 시간 `createdAt`이 `lastChatEnd` 이후인지 비교하여 응답하도록 로직 수정. 프론트에서는 polling 방식으로 최대 5회 재시도 |
| 로그인 후에도 API 호출 시 401 Unauthorized 오류 발생 | Axios 요청 시 `Authorization` 헤더가 누락되거나 `Bearer` 키워드 없이 전송되어 Spring Boot에서 토큰 파싱 실패 | Axios 인스턴스에 interceptors 설정으로 토큰 자동 삽입. 백엔드에서는 `Bearer` 제거 후 파싱 및 인증 처리 |
| Docker 배포 시 코드 수정 사항이 반영되지 않음 | `./gradlew build` 없이 Docker 이미지 생성 시, 이전 버전 JAR이 그대로 포함되어 실행됨 | 배포 전 항상 `./gradlew clean build` 실행 후, `--no-cache` 옵션으로 Docker 이미지 재빌드. Dockerfile 내 JAR 경로도 확인 필요 |

---

## 👨‍👩‍👧‍👦 팀원 역할

| 이름   | 역할                                                                   | GitHub                                           |
| ------ | ---------------------------------------------------------------------- | ------------------------------------------------ |
| 김성하 | PM / 데이터 전처리 / DB 설계 / ERD 설계 / AI 모델링 / FastAPI 서버     | [@julle0123](https://github.com/julle0123)       |
| 정수한 | 데이터 수집 / 데이터 전처리 / 프롬프트 설계 / AI 모델링 / FastAPI 서버 | [@s2-honey](https://github.com/s2-honey)         |
| 김수환 | 프론트엔드 구현 / UI 구성 / 디자인 / Spring Boot API / DB 연동         | [@suhwan87](https://github.com/suhwan87)         |
| 김서연 | 프론트엔드 구현 / UI 구성 / 디자인 / Spring Boot API / DB 연동         | [@kimseoyeon21](https://github.com/kimseoyeon21) |

---

## 📄 라이선스

본 프로젝트는 오픈된 학습 자료로 누구나 자유롭게 사용할 수 있습니다.
