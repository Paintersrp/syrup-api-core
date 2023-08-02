export type UptimeRecordType = { uptime: number; lastChecked: number };
export type UptimeRecords = Map<string, UptimeRecordType>;
export type UptimeRecordsObject = { [key: string]: { uptime: string; lastChecked: string } };

export type RelativeUptime = { hours: number; minutes: number; seconds: number };
