import fs from 'fs';
import { execSync } from 'child_process';

try {
  const vaultPath = 'C:/Users/master/agrolib';
  const logFile = `${vaultPath}/obsidian_log.md`;
  
  if (fs.existsSync(vaultPath)) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logLine = `\n- [${now}] 장애인 접근 편의 제공(K-WAH 2.2 / WCAG 2.2 웹 접근성 도우미 위젯, 3단계 글자 확대, 초고대비 7:1 테마, 가독성 폰트, 링크 강조, 모션 정지, 포커스 강화, 웹접근성 정책 모달) 전체 28개 페이지 일괄 구축 및 GitHub 배포 완료\n`;
    
    fs.appendFileSync(logFile, logLine, 'utf8');
    console.log('Appended log to', logFile);
    
    execSync(`git -C "${vaultPath}" add .`, { stdio: 'inherit' });
    execSync(`git -C "${vaultPath}" commit -m "auto-sync: a11y suite and policy update"`, { stdio: 'inherit' });
    execSync(`git -C "${vaultPath}" push`, { stdio: 'inherit' });
    console.log('Synced agrolib to GitHub successfully.');
  } else {
    console.log('Vault path does not exist, skipping sync:', vaultPath);
  }
} catch (err) {
  console.error('Obsidian sync error:', err.message);
}
