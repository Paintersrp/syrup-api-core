import { parse } from 'js2xmlparser';
import { parse as json2csv } from 'json2csv';

app.use(async (ctx, next) => {
  await next();

  if (!ctx.body) {
    return;
  }

  const acceptType = ctx.accepts(['json', 'xml', 'csv']);

  switch (acceptType) {
    case 'xml':
      ctx.type = 'application/xml';
      ctx.body = parse('response', ctx.body);
      break;
    case 'csv':
      ctx.type = 'text/csv';
      ctx.body = json2csv(ctx.body);
      break;
    case 'json':
    default:
      ctx.type = 'application/json';
      ctx.body = JSON.stringify(ctx.body);
      break;
  }
});
