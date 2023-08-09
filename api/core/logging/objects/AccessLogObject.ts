import Koa from 'koa';

export class AccessLogObject {
  event: string;
  method: string;
  path: string;
  status: number;
  user: string;
  role: string;
  access: 'ALLOW' | 'DENY';
  reason: string;
  requestId: string;
  action: string;
  resource: string;
  userAgent: string | undefined;
  ipAddress: string;
  rule: string;

  constructor(ctx: Koa.Context, access: 'ALLOW' | 'DENY', reason: string, rule: string) {
    const userName = ctx.state.user.username || 'Anonymous';
    const userRole = ctx.state.user.role || 'Guest';

    this.event = 'access_control';
    this.method = ctx.method;
    this.path = ctx.path;
    this.status = ctx.status;
    this.user = userName;
    this.role = userRole;
    this.access = access;
    this.reason = reason;
    this.requestId = ctx.requestId;
    this.action = ctx.request.method;
    this.resource = ctx.request.url;
    this.rule = rule;
    this.userAgent = ctx.header['user-agent'];
    this.ipAddress = ctx.ip;
  }

  public toLogEntry() {
    return {
      event: this.event,
      method: this.method,
      path: this.path,
      status: this.status,
      user: this.user,
      role: this.role,
      access: this.access,
      reason: this.reason,
      requestId: this.requestId,
      action: this.action,
      resource: this.resource,
      rule: this.rule,
      userAgent: this.userAgent,
      ipAddress: this.ipAddress,
    };
  }

  public log(ctx: Koa.Context) {
    ctx.logger.info(this.toLogEntry());
  }
}
