import fs from 'fs';
import { execSync } from 'child_process';

try {
  const vaultPath = 'C:/Users/master/agrolib';
  const logFile = `${vaultPath}/obsidian_log.md`;
  
  if (fs.existsSync(vaultPath)) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logLine = `\n- [${now}] 모바일 히어로 비주얼 개선: 지루하고 세로로 길었던 단일 인물 사진을 청정 목장 및 건강한 송아지, 첨단 바이오 백신 케어 현장 고화질 16:9 비주얼로 전면 교체하고, 모바일 높이를 220px로 대폭 컴팩트화 및 라이브 하이라이트 뱃지 추가 완료\n`;
    
    fs.appendFileSync(logFile, logLine, 'utf8');
    console.log('Appended log to', logFile);
    
    execSync(`git -C "${vaultPath}" add .`, { stdio: 'inherit' });
    execSync(`git -C "${vaultPath}" commit -m "auto-sync: hero visual and mobile layout improvement"`, { stdio: 'inherit' });
    execSync(`git -C "${vaultPath}" push`, { stdio: 'inherit' });
    console.log('Synced agrolib to GitHub successfully.');
  } else {
    console.log('Vault path does not exist, skipping sync:', vaultPath);
  }
} catch (err) {
  console.error('Obsidian sync error:', err.message);
}
