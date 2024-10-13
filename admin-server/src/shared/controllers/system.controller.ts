import { Controller, Get } from '@nestjs/common';
import { spawn } from 'child_process';

@Controller('system')
export class SystemController {
  @Get('database')
  async getDatabase() {
    const ret = await this._spawn('ls', ['-a'], { cwd: './' });
    const data = ('' + ret).split('\n').pop();
    return {
      ok: 1,
      data,
    };
  }

  private async _spawn(command, args, opt) {
    return new Promise((resolve) => {
      const p = spawn(command, args, opt);
      p.stdout.pipe(process.stdout);
      p.stderr.pipe(process.stderr);
      let ret = '';
      p.on('data', (data) => (ret += data));
      p.on('close', () => resolve(ret));
    });
  }
}
