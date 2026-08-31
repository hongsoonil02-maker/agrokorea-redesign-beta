import { writeFileSync } from "node:fs";

const items = [
  [17,"밀크바닐라향 M16","cat4","https://www.agrokorea.kr//upload/product/202510//1761631010_m0192611_20251028145650.jpg","밀크바닐라향이 나는 초강력 향미제로, 사료 기호성 향상으로 사료 섭취량 증가","에틸바닐린 2.8% 이상","양돈","사료톤당 100~250g 혼합하여 급여","20kg(5kg*4ea),  지대 혹은 박스","제조일로부터 18개월","DDC (DadHank Biotech, 중국)"],
  [18,"산딸기향 F9","cat4","https://www.agrokorea.kr//upload/product/202510//1761630972_m0161523_20251028145612.jpg","산딸기향이 나는 초강력 향미제로, 사료 기호성 향상으로 사료 섭취량 증가","낙산에틸 0.2%이상","양돈, 축우","사료톤당 100~250g 혼합하여 급여","20kg(5kg*4ea), 박스","제조일로부터 18개월","DDC (DadHank Biotech, 중국)"],
  [19,"당밀향","cat4","https://www.agrokorea.kr//upload/product/202510//1761631032_m0180005_20251028145712.jpg","당밀향이 나는 초강력 향미제로, 사료 기호성 향상으로 사료 섭취량 증가","에틸말톨 5.75% 이상","축우, 양돈","사료톤당 100~250g 혼합하여 급여","20kg, 지대","제조일로부터 18개월","DDC (DadHank Biotech, 중국)"],
  [20,"건초향 H9","cat4","https://www.agrokorea.kr//upload/product/202510//1761631062_m0143864_20251028145742.jpg","건초향이 나는 초강력 향미제로, 사료 기호성 향상으로 사료 섭취량 증가","리날로올 0.2% 이상.","축우, 양돈","사료톤당 100~250g 혼합하여 급여","20kg(5kg*4ea), 지대","제조일로부터 18개월","DDC (DadHank Biotech, 중국)"],
  [29,"어분향 Y5","cat4","https://www.agrokorea.kr//upload/product/202510//1761630954_m0170404_20251028145554.jpg","어분향이 나는 초강력 향미제로, 사료 기호성 향상으로 사료 섭취량 증가","카프릴산 0.5% 이상","양어","사료톤당 100~250g 혼합하여 급여","20kg, 지대","제조일로부터 18개월","DDC (DadHank Biotech, 중국)"],
  [30,"버터향","cat4","https://www.agrokorea.kr//upload/product/202510//1761631093_m0168656_20251028145813.jpg","버터향이 나는 초강력 향미제로, 사료 기호성 향상으로 사료 섭취량 증가","바닐린 7 % 이상","양돈","사료톤당 200~500g 혼합하여 급여","20kg, 지대","제조일로부터 18개월","DDC (DadHank Biotech, 중국)"],
  [31,"레몬향","cat4","https://www.agrokorea.kr//upload/product/202510//1761631121_m0134022_20251028145841.jpg","레몬향이 나는 초강력 향미제로, 사료 기호성 향상으로 사료 섭취량 증가","사카린나트륨 60 % 이상","양돈, 축우","사료톤당 100~250g 혼합하여 급여","20kg(5kg*4ea), 지대","제조일로부터 36개월","DDC (DadHank Biotech, 중국)"],
  [32,"치킨향 P5","cat4","https://www.agrokorea.kr//upload/product/202510//1761630898_m0167796_20251028145458.jpg","닭고기향이 나는 초강력 향미제로, 사료 기호성 향상으로 사료 섭취량 증가","L-글루타민산 0.2% 이상","반려동물용","사료톤당 1.0~5.0kg 혼합하여 급여","20kg(2kg*10ea), 지대","제조일로부터 12개월","DDC (DadHank Biotech, 중국)"],
  [33,"비프향 P6","cat4","https://www.agrokorea.kr//upload/product/202510//1761631153_m0158778_20251028145913.jpg","소고기향이 나는 초강력 향미제로, 사료 기호성 향상으로 사료 섭취량 증가","L-글루타민산 0.1% 이상","반려동물용","사료톤당 1.0~5.0kg 혼합하여 급여","20kg(2kg*10ea), 지대","제조일로부터 12개월","DDC (DadHank Biotech, 중국)"],
  [34,"S13 사카린나트륨","cat4","https://www.agrokorea.kr//upload/product/202510//1761616527_m0134333_20251028105527.jpg","","","","","","",""],
  [35,"SX907","cat4","https://www.agrokorea.kr//upload/product/202510//1761630938_m0156406_20251028145538.jpg","","","","","","",""],
  [36,"에센셜오일 TS","cat4","https://www.agrokorea.kr//upload/product/202508//1756258595_m0139060_20250827103635.jpg","","","","","","",""],
  [37,"뷰티네스트 (VTNEST)","cat4","https://www.agrokorea.kr//upload/product/202508//1756258639_m0136517_20250827103719.jpg","","","","","","",""],
  [38,"리퀴 (LIQI)","cat4","https://www.agrokorea.kr//upload/product/202508//1756258683_m0156920_20250827103803.jpg","","","","","","",""],
  [39,"슈라미","cat4","https://www.agrokorea.kr//upload/product/202508//1756258728_m0197143_20250827103848.jpg","","","","","","",""],
  [40,"케라트릭스","cat4","https://www.agrokorea.kr//upload/product/202508//1756258769_m0118955_20250827103929.jpg","","","","","","",""],
  [41,"엠에스엠(MSM)","cat4","https://www.agrokorea.kr//upload/product/202508//1756258813_m0165962_20250827104013.jpg","","","","","","",""],
  [42,"카프브류(CalfBrew)","cat4","https://www.agrokorea.kr//upload/product/202508//1756258880_m0185816_20250827104120.jpg","","","","","","",""],
  [43,"펫브류(Petbrew)","cat4","https://www.agrokorea.kr//upload/product/202508//1756258924_m0118406_20250827104204.jpg","","","","","","",""],
  [44,"디엔지1000 (DNG1000)","cat4","https://www.agrokorea.kr//upload/product/202508//1756258984_m0116893_20250827104304.jpg","","","","","","",""],
  [45,"디엔지200 (DNG200)","cat4","https://www.agrokorea.kr//upload/product/202508//1756259020_m0198602_20250827104340.jpg","","","","","","",""],
  [46,"이스트컬쳐(YeastCulture)","cat4","https://www.agrokorea.kr//upload/product/202508//1756259060_m0155509_20250827104420.jpg","","","","","","",""],
  [47,"가바믹스 10%","cat4","https://www.agrokorea.kr//upload/product/202508//1756259099_m0138604_20250827104459.jpg","","","","","","",""],
  [48,"가바썸머 10%","cat4","https://www.agrokorea.kr//upload/product/202510//1761628093_m0182304_20251028140813.jpg","","","","","","",""],
  [49,"콕시큐어-H(가루)","cat4","https://www.agrokorea.kr//upload/product/202508//1756259278_m0144878_20250827104758.jpg","","","","","","",""],
  [50,"아그로부스터","cat4","https://www.agrokorea.kr//upload/product/202508//1756259313_m0176615_20250827104833.jpg","","","","","","",""],
  [51,"골드믹스 플러스","cat4","https://www.agrokorea.kr//upload/product/202508//1756259366_m0153942_20250827104926.jpg","","","","","","",""],
  [52,"VTR 만난아제","cat4","https://www.agrokorea.kr//upload/product/202508//1756259659_m0137565_20250827105419.jpg","","","","","","",""],
  [53,"더마니","cat4","https://www.agrokorea.kr//upload/product/202508//1756259592_m0187278_20250827105312.jpg","","","","","","",""],
  [54,"VTR 프로테아제","cat4","https://www.agrokorea.kr//upload/product/202508//1756259626_m0110617_20250827105346.jpg","","","","","","",""],
  [55,"VTR 자일라나아제","cat4","https://www.agrokorea.kr//upload/product/202508//1756259659_m0137565_20250827105419.jpg","","","","","","",""],
  [56,"과자박","cat5","https://www.agrokorea.kr//upload/product/202510//1761631153_m0158778_20251028145913.jpg","","","","","","",""],
  [57,"옥수수주정박","cat5","https://www.agrokorea.kr//upload/product/202508//1756259592_m0187278_20250827105312.jpg","","","","","","",""],
  [58,"호마박","cat5","https://www.agrokorea.kr//upload/product/202508//1756259626_m0110617_20250827105346.jpg","","","","","","",""],
  [59,"커피박","cat5","https://www.agrokorea.kr//upload/product/202510//1761630898_m0167796_20251028145458.jpg","","","","","","",""],
  [60,"단백피(옥수수단백피)","cat5","https://www.agrokorea.kr//upload/product/202510//1761631121_m0134022_20251028145841.jpg","","","","","","",""],
  [61,"전분박","cat5","https://www.agrokorea.kr//upload/product/202510//1761631093_m0168656_20251028145813.jpg","","","","","","",""],
  [62,"Sprayfo","cat5","https://www.agrokorea.kr//upload/product/202510//1761630954_m0170404_20251028145554.jpg","","","","","","",""],
  [63,"젬스밀크","cat5","https://www.agrokorea.kr//upload/product/202508//1756258683_m0156920_20250827103803.jpg","","","","","","",""],
  [64,"마이 베이비 밀크","cat5","https://www.agrokorea.kr//upload/product/202508//1756258728_m0197143_20250827103848.jpg","","","","","","",""],
  [65,"바이탈밀크 펠렛","cat5","https://www.agrokorea.kr//upload/product/202508//1756258769_m0118955_20250827103929.jpg","","","","","","",""],
  [66,"바이탈밀크 뮤즐리","cat5","https://www.agrokorea.kr//upload/product/202508//1756258813_m0165962_20250827104013.jpg","","","","","","",""],
  [67,"AK 배합사료","cat5","https://www.agrokorea.kr//upload/product/202508//1756258880_m0185816_20250827104120.jpg","","","","","","",""],
  [131,"크림향","cat4","https://www.agrokorea.kr//upload/product/202508//1756258924_m0118406_20250827104204.jpg","","","","","","",""],
  [132,"애니스위트 향","cat4","https://www.agrokorea.kr//upload/product/202508//1756258984_m0116893_20250827104304.jpg","","","","","","",""],
  [133,"당밀향 (액상)","cat4","https://www.agrokorea.kr//upload/product/202508//1756259020_m0198602_20250827104340.jpg","","","","","","",""],
  [134,"치즈향","cat4","https://www.agrokorea.kr//upload/product/202508//1756259060_m0155509_20250827104420.jpg","","","","","","",""],
  [135,"웜닐-H","cat4","https://www.agrokorea.kr//upload/product/202603//1773206084_m0124173_20260311141444.png","WormNil-H는 천연 식물 추출물 기반의 동물용 구충제로, 내부 기생충을 억제하고 소화 건강과 영양 흡수, 면역력을 개선해 가축의 성장과 생산성을 높이는 데 도움을 주는 제품","조단백질 8.0% 이상, 조섬유 1.5% 이상, 수분 8.0% 이하","가금류, 양돈 (양축농가용)","사료톤당 0.5~3.0kg 혼합하여 급여","25kg 지대","제조일로부터 36개월","Veesure (인도)"],
  [136,"베타콜 (VETACOL)","cat4","https://www.agrokorea.kr//upload/product/202604//1776833236_m0114522_20260422134716.png","출생 직후 송아지의 면역력 형성과 초기 생존율 향상을 위해 설계된 액상 초유 보충제로, 풍부한 영양과 유익균을 공급하여 장 건강과 성장 발달을 돕습니다.","조단백질 (13.4% 이상), 조섬유 (2.3% 이상), 바실러스 서브틸리스 (1.0 × 10⁶ CFU/g 이상)\n바실러스 리케니포미스 (4.75 × 10⁶ CFU/g 이상), 수분 (46.0% 이하)","송아지","송아지 출생 후 가능한 빠르게 15ml 주입기 1개 투여","15 ml (1회용 주사기)","제조일로부터 18개월","VETALIS Laboratoire, 프랑스"]
];

function esc(s) { return String(s).replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n"); }

const jsLines = ["window.PRODUCT_DATA = ["];
for (const row of items) {
  const [uid, name, cat, image, description, ingredients, targetLivestock, usage, packaging, shelfLife, manufacturer] = row;
  jsLines.push(`  {"uid":${uid},"name":"${esc(name)}","cat":"${cat}","image":"${image}","description":"${esc(description || "")}","ingredients":"${esc(ingredients || "")}","targetLivestock":"${esc(targetLivestock || "")}","usage":"${esc(usage || "")}","packaging":"${esc(packaging || "")}","shelfLife":"${esc(shelfLife || "")}","manufacturer":"${esc(manufacturer || "")}"}`);
}
jsLines.push("];");

writeFileSync("js/product-data.js", jsLines.join("\n") + "\n", "utf8");
console.log(`✓ Wrote ${items.length} products to js/product-data.js`);
