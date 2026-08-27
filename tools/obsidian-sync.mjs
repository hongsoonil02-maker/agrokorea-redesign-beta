import fs from 'fs';
import { execSync } from 'child_process';

try {
  const vaultPath = 'C:/Users/master/agrolib';
  const logFile = `${vaultPath}/obsidian_log.md`;
  
  if (fs.existsSync(vaultPath)) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logLine = `\n- [${now}] GitHub Issue #1(신문 기사/임상 포스터 텍스트 가독성 개선, 원본 지면 라이트박스 뷰어 구현) 및 Issue #2(전체 28개 페이지 네이버 스마트스토어 링크 배지/모바일 배너 추가) 반영 완료\n`;
    
    fs.appendFileSync(logFile, logLine, 'utf8');
    console.log('Appended log to', logFile);
    
    execSync(`git -C "${vaultPath}" add .`, { stdio: 'inherit' });
    execSync(`git -C "${vaultPath}" commit -m "auto-sync: dev log update"`, { stdio: 'inherit' });
    execSync(`git -C "${vaultPath}" push`, { stdio: 'inherit' });
    console.log('Synced agrolib to GitHub successfully.');
  } else {
    console.log('Vault path does not exist, skipping sync:', vaultPath);
  }
} catch (err) {
  console.error('Obsidian sync error:', err.message);
}
