import { RelatedJSON, WantTo } from '../src/index';

const rdb = new RelatedJSON();
rdb.connect({ to: "../dist/test.json" });
const wt = WantTo;

rdb.create(wt.TABLE, "User", {});
