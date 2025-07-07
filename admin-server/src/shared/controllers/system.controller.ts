import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { spawn } from 'child_process';
import moment from 'moment';

@ApiTags('对系统的操作，数据库备份恢复')
@Controller('system')
export class SystemController {
  @ApiOperation({summary: '获取数据库文件列表'})
  @Get('database')
  async getDatabase() {
    const ret = await this._spawn('docker-compose', ['-T', 'mongo', 'ls', '/dump'], { cwd: './' });
    const data = ('' + ret).split('\n').pop();
    return {
      ok: 1,
      data,
    };
  }

  @ApiOperation({summary: '数据库备份'})
  @Post('database/dump')
  async dumpDataBase() {
    await this._spawn('docker-compose', ['-T', 'mongo', 'mongodump', '--db', 'lowcode', '--out', '/dump'+ moment().format('YYYYMMDDhhmmss')], {cwd: './'});
    return {
      ok: 1
    }
  }

  @ApiOperation({summary: '数据库恢复'})
  @Post('database/restore')
  async restoreDataBase(@Body() data: any) {
    await this._spawn('docker-compose', ['-T', 'mongo', 'mongorestore', '--db', 'lowcode', '/dump' + data.file+ '/lowcode'], {cwd: './'});
    return {
      ok: 1
    }
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
