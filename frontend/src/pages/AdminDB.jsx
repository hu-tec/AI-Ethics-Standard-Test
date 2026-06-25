import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

/* ============================================================
   관리자 DB 관리 — mockup-admin-hd.html 이식
   · 30개 테이블 선택기 (엑셀 DB설계 기준)
   · 실제 테이블(회원/접수/진단)은 라이브 DB, 나머지는 설계 샘플
   ============================================================ */

// 실제 DB 연동 테이블
const LIVE = {
  회원정보: { sec: '실DB · users', loader: () => api.adminUsers() },
  접수관리: { sec: '실DB · exam_applications', loader: () => api.adminApplications() },
  진단결과: { sec: '실DB · diagnosis_results', loader: () => api.adminDiagnosis() },
}

const SELECTOR = [
  ['실시간 DB', ['회원정보', '접수관리', '진단결과']],
  ['시험', ['시험정보', '자격증', '시험양식', '문제및채점']],
  ['전문가', ['전문가정보']],
  ['결제', ['결제정보', '결제기준']],
  ['구독·연습·AI', ['구독등급정의', '회원구독이력', '연습패키지', '연습응시기록', 'AI분석리포트', '학습이력', '오답분석']],
  ['B2B', ['B2B기업정보', '단체접수']],
  ['운영', ['공지사항', '블로그', '1:1상담', '알림', 'FAQ', '메인배너', '팝업', '이용약관', '관리자']],
  ['챗봇·통계', ['챗봇FAQ', '챗봇대화로그', '통계집계']],
]

// 설계 샘플 테이블 (엑셀 「3. DB 설계」 기준)
const SAMPLE = {
  시험정보: { sec: '◆2 시험 정보', cols: ['시험관리번호', '시험가능기간', '시험일', '지역', '성적발표일', '접수구분', '차수', '시험종목', '시험명', '시험등급', '검정과목', '교시', '출발어', '도착어', '시작시간', '종료시간', '접수생수'], rows: [
    ['EXM-26-ETH-02', '26.06.01~07.12', '2026-07-12', '온라인', '2026-07-26', '정시', '26년 2차', 'AI언어시험', '2026 2차 AI 윤리', '전문', '윤리', '1교시', '—', '—', '10:00', '11:40', '684'],
    ['EXM-26-TRN-02', '26.06.01~07.19', '2026-07-19', '온라인', '2026-08-02', '정시', '26년 2차', '번역 자격증', '2026 2차 AI 번역', '기초', '번역', '1교시', '한국어', '영어', '14:00', '15:20', '421'],
  ] },
  자격증: { sec: '◆4 자격증', cols: ['신청여부', '종류', '금액', '사진', '출력일', '출력상태', '배송일', '배송상태'], rows: [
    ['신청', '카드 자격증', '3000', 'dohyun.jpg', '2026-07-28', '출력완료', '2026-07-30', '배송완료'],
    ['신청', '원본대조필', '5000', 'minjun.jpg', '2026-07-08', '출력완료', '2026-07-10', '배송완료'],
  ] },
  시험양식: { sec: '◆5 시험 양식', cols: ['양식번호', '양식구분', '양식명', '단계', '총문항수', '파일종류', '출제파일', '사용번역기', '사용AI', '총점', '합격점수', '배점'], rows: [
    ['FORM-001', '설문', 'AI 윤리 시나리오', '3', '40', '문서(TTT)', 'ethics.docx', '—', 'ChatGPT', '100', '80', '2.5'],
    ['FORM-002', '번역', '웹툰 번역', '3', '15', '문서(TTT)', 'webtoon.docx', 'DeepL/파파고', 'ChatGPT', '500', '200', '33'],
  ] },
  문제및채점: { sec: '◆6 문제 및 채점', cols: ['시험명', '시험등급', '문제', '정답1', '정답2', '채점방법', '1차평가요소', '2차평가요소', '단어수', '유사어'], rows: [
    ['2026 2차 AI 윤리', '전문', 'AI 활용의 윤리적 문제는?', '편향성', '투명성 부족', '자동+휴먼', '정확성', '논리성', '—', '공정성,편향'],
    ['2026 2차 AI 번역', '기초', '다음 문장을 영어로', 'The cat sat on the mat', 'A cat was on the mat', '자동+휴먼', '정확성', '자연스러움', '8', 'feline,kitty'],
  ] },
  전문가정보: { sec: '◆7 전문가 정보', cols: ['전문가번호', '가입일', '이름', '이메일', '승인상태', '레벨', '활동가능시간', '평점', '활동횟수', '리뷰건', '은행명', '계좌번호', '학교명', '학과', '졸업여부', '회사명', '직위', '저서명', '자격증', '관리자메모'], rows: [
    ['EXP001', '2025-03-10', '김번역', 'translator.kim@email.com', '전문가 승인', 'A', '평일오후/주말', '4.8', '127', '89', '국민은행', '123-45-6789', '서울대', '영문과', '졸업', 'ABC번역', '팀장', '실전 번역의 기술', '번역 1급', '우수 전문가'],
    ['EXP002', '2025-04-22', '이통역', 'interpreter.lee@email.com', '전문가 요청', 'B', '평일 종일', '—', '0', '0', '카카오뱅크', '333-01-44455', '연세대', '통역대학원', '졸업', '글로벌컴', '대리', '—', '통역사 자격증', '승인 검토중'],
  ] },
  결제정보: { sec: '◆8 결제 정보', cols: ['장바구니번호', '결제번호', '결제일', '결제분류', '결제내용', '이용금액', '할인금액', '결제금액', '보유포인트', '결제방법', '결제상태', '환불상태', '환불계좌', '환불은행', '환불예금주', '환불금액'], rows: [
    ['CART2406001', 'PAY2406001', '2026-06-25', '서비스 이용', 'AI 윤리 전문+자격증', '60000', '0', '63000', '12500', '카드 결제', '결제 완료', '—', '—', '—', '—', '—'],
    ['CART2503021', 'PAY2503021', '2026-06-20', '서비스 이용', 'AI 번역 기초', '35000', '0', '35000', '1000', '카드 결제', '환불', '환불 완료', '3333-01-1234567', '카카오뱅크', '한소희', '35000'],
  ] },
  결제기준: { sec: '◆9 결제 기준', cols: ['결제기준번호', '수정적용일', '서비스구분', '카테고리(대)', '카테고리(중)', '카테고리(소)', '최종금액'], rows: [
    ['STD001', '2026-01-01', 'AI', '시험', '윤리', '전문', '60000'],
    ['STD002', '2026-01-01', '번역', '시험', '영어', '기초', '35000'],
  ] },
  공지사항: { sec: '◆10 공지사항', cols: ['공지번호', '사이트구분', '작성일', '제목', '내용', '작성자', '조회수'], rows: [
    ['NOT26-001', '시험', '2026-06-20', '2026년 2차 AI 윤리 접수 안내', '7월 12일 시행', '관리자', '1284'],
    ['NOT26-002', '시험', '2026-06-10', '자격증 발급 일정 변경', '발급은 시험 후 2주 이내', '관리자', '842'],
  ] },
  블로그: { sec: '◆11 블로그', cols: ['블로그번호', '사이트구분', '작성일', '제목', '내용', '조회수'], rows: [
    ['BLOG-001', '시험', '2026-06-15', 'AI 윤리, 왜 중요한가', 'AI 시대 필수 역량', '3201'],
    ['BLOG-002', '시험', '2026-06-05', 'AI 번역 자격증 활용법', '취업/이직 활용', '1875'],
  ] },
  '1:1상담': { sec: '◆12 1:1 상담', cols: ['상담번호', '상태', '문의분류', '표시방법', '답변자', '상담일', '완료일', '문의제목', '문의내용', '관리자메모'], rows: [
    ['CS26-014', '답변 완료', '자격증', '관리자', '김관리', '2026-06-20', '2026-06-21', '자격증 배송 문의', '언제 도착하나요?', '단순 문의'],
    ['CS26-015', '답변 중', '환불', '관리자', '—', '2026-06-24', '—', '환불 요청합니다', '개인사정 취소', '7일전 환불대상'],
  ] },
  알림: { sec: '◆13 알림', cols: ['알림번호', '발송분류', '알림방법'], rows: [['ALM-001', '시험 결과', '카카오톡'], ['ALM-002', '결제', '메일']] },
  FAQ: { sec: '◆14 FAQ', cols: ['FAQ번호', '사이트구분', '질문', '내용'], rows: [
    ['FAQ-001', '시험', '시험은 어디서 보나요?', '온라인 CBT로 응시합니다.'],
    ['FAQ-002', '시험', '응시료 환불 규정은?', '시험 7일 전까지 100% 환불.'],
  ] },
  메인배너: { sec: '◆15 메인 배너', cols: ['배너번호', '사이트구분', '게시시작일', '이미지'], rows: [['BAN-001', '시험', '2026-06-01', 'banner_july.png'], ['BAN-002', '시험', '2026-05-15', 'banner_cert.png']] },
  팝업: { sec: '◆16 팝업', cols: ['팝업번호', '사이트구분', '게시기간', '이미지', '텍스트'], rows: [['POP-001', '시험', '26.06.20~07.12', 'popup_apply.png', '2차 접수 중'], ['POP-002', '시험', '26.06.01~06.10', 'popup_event.png', '얼리버드 할인']] },
  이용약관: { sec: '◆17 이용약관', cols: ['약관번호', '사이트구분', '내용', '필수여부'], rows: [['TERM-001', '시험', '제1조 (목적)...', '필수'], ['TERM-002', '시험', '마케팅 정보 수신...', '선택']] },
  관리자: { sec: '◆18 관리자', cols: ['아이디', '비밀번호', '이름', '관리자권한', '범위설정', '해당권한', '목록별', '표시/숨기기'], rows: [
    ['admin@hutechc.com', '********', '김관리', '마스터', '모든 사이트/모든 메뉴', '읽기/쓰기/저장/삭제', '관리 번호', '표시'],
    ['pay@hutechc.com', '********', '박결제', '결제 담당자', '특정 사이트/특정 메뉴', '읽기/쓰기', '아이디', '표시'],
  ] },
  연습패키지: { sec: '◆19 연습문제 패키지', cols: ['패키지번호', '패키지명', '시험종목', '제공횟수', '가격', '노출여부'], rows: [['PRAC001', '기본 3회 팩', 'AI 윤리', '3', '15000', 'Y'], ['PRAC002', '집중 5회 팩', 'AI 번역', '5', '25000', 'Y']] },
  연습응시기록: { sec: '◆19 연습 응시 기록', cols: ['연습응시번호', '회원번호', '패키지번호', '응시일', '총점', '오답목록'], rows: [['EX241010001', 'EX2406001', 'PRAC001', '2026-06-18', '78', '[3,7,12]'], ['EX241010002', 'EX2501015', 'PRAC002', '2026-06-19', '85', '[5]']] },
  AI분석리포트: { sec: '◆20 AI 분석 리포트', cols: ['리포트번호', '회원번호', '접수번호', '분석등급', '구매여부', '분석내용', '생성일', 'PDF URL'], rows: [
    ['RPT001', 'EX2406001', 'EX26071201', '프리미엄', 'Y(유료)', '{투명성:80,공정성:72}', '2026-07-26', 'rpt001.pdf'],
    ['RPT002', 'EX2606004', '—', '무료기본', 'N(무료)', '{진단:85,A}', '2026-06-25', 'rpt002.pdf'],
  ] },
  구독등급정의: { sec: '◆21 구독 등급 정의', cols: ['등급코드', '등급명', '월가격', '혜택목록'], rows: [['PREMIUM', '프리미엄', '39900', '{practice:10,ai:advanced}'], ['STANDARD', '스탠다드', '19900', '{practice:5,ai:basic}']] },
  회원구독이력: { sec: '◆21 회원 구독 이력', cols: ['구독이력번호', '회원번호', '등급코드', '시작일', '종료일', '자동갱신'], rows: [['SUB26-001', 'EX2406001', 'PREMIUM', '2026-01-01', '—', 'Y'], ['SUB26-002', 'EX2501015', 'STANDARD', '2026-03-01', '—', 'Y']] },
  B2B기업정보: { sec: '◆22 B2B 기업 정보', cols: ['기업번호', '사업자등록번호', '기업명', '담당자명', '담당자이메일', '승인상태'], rows: [['BIZ001', '123-45-67890', '삼성SDS', '박인사', 'hr@samsung.com', '승인'], ['BIZ002', '220-88-12345', 'LG CNS', '김교육', 'edu@lgcns.com', '대기']] },
  단체접수: { sec: '◆22 단체 접수', cols: ['단체접수번호', '기업번호', '시험정보', '구성원목록', '결제금액', '세금계산서발행'], rows: [['GRP26-0007', 'BIZ001', '2026 2차 AI 윤리', '김O준 외 31명', '1920000', 'Y'], ['GRP26-0008', 'BIZ002', '2026 2차 AI 번역', '이O수 외 19명', '700000', 'N']] },
  학습이력: { sec: '◆23 학습 이력', cols: ['이력번호', '회원번호', '시험종목', '영역', '평균점수'], rows: [['HIS-001', 'EX2406001', 'AI 윤리', '투명성', '82'], ['HIS-002', 'EX2406001', 'AI 윤리', '공정성', '71']] },
  오답분석: { sec: '◆23 오답 분석', cols: ['분석번호', '문제번호', '오답률', '주요오답패턴', '집계날짜'], rows: [['WRG-001', 'Q-0012', '64.2', '[편향성 혼동]', '2026-06-25'], ['WRG-002', 'Q-0027', '51.8', '[직역 오류]', '2026-06-25']] },
  챗봇FAQ: { sec: '◆24 챗봇 FAQ', cols: ['FAQ번호', '질문키워드', '답변내용', '카테고리', '노출순위'], rows: [['BOT001', '자격증 배송', '발급 후 3~5일 내 배송', '자격증', '1'], ['BOT002', '응시료 환불', '시험 7일 전 100% 환불', '결제', '2']] },
  챗봇대화로그: { sec: '◆24 챗봇 대화 로그', cols: ['대화번호', '회원번호', '대화내용', '미답변여부', '대화시작일시'], rows: [['CHAT-001', 'EX2606004', '[{user:접수방법?}]', 'N', '2026-06-25 09:10'], ['CHAT-002', '—', '[{user:환불되나요?}]', 'Y', '2026-06-24 18:22']] },
  통계집계: { sec: '◆25 통계 집계', cols: ['집계번호', '집계유형', '기준날짜', '시험종목', '접수자수', '응시자수', '합격자수', '합격률', '매출합계', '신규회원수', 'AI분석구매수'], rows: [
    ['STAT-0625', '일별', '2026-06-25', '전체', '247', '—', '—', '—', '43250000', '312', '33'],
    ['STAT-0624', '일별', '2026-06-24', '전체', '198', '176', '137', '77.8', '38900000', '287', '28'],
  ] },
}

function liveToTable(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return { cols: [], rows: [] }
  const cols = Object.keys(arr[0])
  const rows = arr.map((o) => cols.map((c) => {
    const v = o[c]
    if (v === null || v === undefined || v === '') return '—'
    if (typeof v === 'object') return JSON.stringify(v)
    return String(v)
  }))
  return { cols, rows }
}

const CSS = `
.adb{font-family:Arial,"Noto Sans KR",sans-serif;color:#1f2937;}
.adb .sel{display:flex;gap:4px;align-items:center;overflow-x:auto;padding:8px 10px;border:1px solid #d8e0ea;border-radius:8px;background:#fafbfc;white-space:nowrap;margin-bottom:8px;}
.adb .sgrp{font-size:8px;color:#9aa6b2;margin:0 1px 0 8px;flex-shrink:0;font-weight:700;}
.adb .tab{flex-shrink:0;border:1px solid #d8e0ea;background:#fff;border-radius:6px;padding:5px 10px;font-size:9px;font-weight:600;cursor:pointer;}
.adb .tab.live{border-color:#bfe9cf;background:#f0fdf4;color:#0f7a3a;}
.adb .tab.active{background:#16a34a;color:#fff;border-color:#16a34a;}
.adb .head2{padding:8px 12px;border:1px solid #d8e0ea;border-bottom:0;border-radius:8px 8px 0 0;background:#fbfdff;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;}
.adb .head2 b{font-size:12px;color:#0f172a;}
.adb .head2 .meta{font-size:9px;color:#6b7280;}
.adb .badge-live{font-size:8px;font-weight:700;background:#dcfce7;color:#0f7a3a;border:1px solid #bbf7d0;border-radius:999px;padding:2px 7px;}
.adb .badge-design{font-size:8px;font-weight:700;background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;border-radius:999px;padding:2px 7px;}
.adb .scroll{overflow:auto;max-height:70vh;border:1px solid #d8e0ea;border-radius:0 0 8px 8px;}
.adb table{border-collapse:collapse;table-layout:auto;width:max-content;min-width:100%;background:#fff;}
.adb th,.adb td{border:1px solid #d8e0ea;padding:5px 8px;font-size:8px;white-space:nowrap;text-align:left;font-weight:400;}
.adb thead th{position:sticky;top:0;background:#e9f9ef;color:#0f7a3a;font-weight:600;z-index:2;}
.adb .num{position:sticky;left:0;background:#f8fafc;text-align:center;color:#94a3b8;z-index:1;width:34px;}
.adb thead .num{z-index:3;background:#e9f9ef;color:#0f7a3a;}
.adb tbody tr:hover td{background:#f6fbf8;}
.adb td.dim{color:#c2cad4;}
.adb .empty{padding:30px;text-align:center;color:#94a3b8;font-size:11px;}
`

export default function AdminDB() {
  const [table, setTable] = useState('회원정보')
  const [liveData, setLiveData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadLive = useCallback(async (name) => {
    if (!LIVE[name] || liveData[name]) return
    setLoading(true); setError('')
    try {
      const arr = await LIVE[name].loader()
      setLiveData((cur) => ({ ...cur, [name]: liveToTable(arr) }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [liveData])

  useEffect(() => { if (LIVE[table]) loadLive(table) }, [table, loadLive])

  const isLive = !!LIVE[table]
  const data = isLive ? (liveData[table] || { cols: [], rows: [] }) : SAMPLE[table]
  const sec = isLive ? LIVE[table].sec : SAMPLE[table]?.sec

  const refresh = () => { setLiveData((cur) => ({ ...cur, [table]: undefined })); loadLive(table) }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5">
      <style>{CSS}</style>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-gray-900">DB 관리</h1>
          <p className="text-[11px] text-gray-500">엑셀 30개 테이블 · 실시간 DB 3개 + 설계 27개</p>
        </div>
        <Link to="/admin" className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">← 관리자 대시보드</Link>
      </div>

      <div className="adb">
        {/* 테이블 선택기 */}
        <div className="sel">
          {SELECTOR.map(([group, names]) => (
            <span key={group} className="contents">
              <span className="sgrp">{group}</span>
              {names.map((name) => (
                <button
                  key={name}
                  onClick={() => setTable(name)}
                  className={`tab ${LIVE[name] ? 'live' : ''} ${table === name ? 'active' : ''}`}
                >
                  {name}
                </button>
              ))}
            </span>
          ))}
        </div>

        {/* 테이블 헤더 */}
        <div className="head2">
          <div>
            <b>{table}</b>{' '}
            {isLive
              ? <span className="badge-live">● 실시간 DB</span>
              : <span className="badge-design">설계</span>}
            <span className="meta"> · {sec} · {data?.cols?.length || 0}개 필드 · {data?.rows?.length || 0}행</span>
          </div>
          {isLive && (
            <button onClick={refresh} className="rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-bold text-gray-600 hover:bg-gray-50">
              {loading ? '불러오는 중…' : '↻ 새로고침'}
            </button>
          )}
        </div>

        {/* 데이터 표 */}
        {error ? (
          <div className="scroll"><div className="empty text-red-500">불러오기 실패: {error}</div></div>
        ) : loading && isLive ? (
          <div className="scroll"><div className="empty">DB에서 데이터를 불러오는 중…</div></div>
        ) : !data || data.cols.length === 0 ? (
          <div className="scroll"><div className="empty">{isLive ? '데이터가 없습니다 (0행).' : '준비중'}</div></div>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th className="num">No</th>
                  {data.cols.map((c) => <th key={c}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, ri) => (
                  <tr key={ri}>
                    <td className="num">{ri + 1}</td>
                    {row.map((val, ci) => <td key={ci} className={val === '—' ? 'dim' : ''}>{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
