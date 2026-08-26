# 이카운트(ECOUNT) 재고 연동 도구 — 로컬 전용

이 폴더는 **공개 웹사이트에 포함되지 않는** 내부 도구입니다.
인증키가 웹에 노출되면 안 되므로 모든 호출은 로컬에서 실행합니다.

## 현재 상태 (2026-08-26 실측)

- Zone 조회 성공: `COM_CODE=662778` → `ZONE=CC`, base `https://oapiCC.ecount.com`
- OAPILogin 엔드포인트 확인 완료: `/OAPI/V2/OAPILogin`
- **로그인 실패(Code 20)**: `.env`의 `USER_ID`가 잘못됨
  - 키 발급ID "AGROKOREA"는 키 이름일 뿐, 실제 이카운트 **로그인 계정 ID**를 넣어야 함
  - 마스터 계정 ID로 시도할 것. 키 유효기간 2026-09-09까지 확인 필요

## 사용법

```powershell
# 1) 프로젝트 루트의 .env 작성 (tools/ecount/.env.example 참고)
#    USER_ID = 실제 이카운트 계정 ID
node tools/ecount/ecount-sync.mjs            # 오늘 기준 재고
node tools/ecount/ecount-sync.mjs 20260825   # 특정일 재고
```

결과는 `tools/ecount/out/inventory.json` 저장 (gitignore 됨).

## API 규격 요약

| 단계 | 메서드/경로 | 비고 |
|---|---|---|
| Zone 조회 | POST `https://oapi.ecount.com/OAPI/V2/Zone` `{COM_CODE}` | prod |
| 로그인 | POST `https://oapi{ZONE}.ecount.com/OAPI/V2/OAPILogin` `{COM_CODE, USER_ID, API_CERT_KEY, LAN_TYPE, ZONE}` → `Data.Datas.SESSION_ID` | |
| 재고 목록 | POST `.../OAPI/V2/InventoryBalance/GetListInventoryBalanceStatus?SESSION_ID=...` `{BASE_DATE:YYYYMMDD, PROD_CD:""}` | **10분에 1회 제한** |
| 재고 단건 | POST `.../OAPI/V2/InventoryBalance/ViewInventoryBalanceStatus` `{BASE_DATE, PROD_CD}` | 1초에 1회 |

품목 연동 팁: ERP 품목명은 사람이 쓰는 이름이라 복잡함 → 품목코드(PROD_CD) 기준으로
매핑 테이블(`tools/ecount/product-map.json` 예정)을 만들고, 홈페이지에는 코드→브랜드 매핑만 노출.

## 보안 원칙

1. 인증키는 절대 프론트엔드 JS에 넣지 않는다.
2. 향후 실시간 재고 노출이 필요하면 Cloudflare Workers(무료)에 서버키를 두고
   홈페이지는 Worker 결과(JSON)만 fetch한다.
3. `.env`는 gitignore 확인 후 커밋 금지.
