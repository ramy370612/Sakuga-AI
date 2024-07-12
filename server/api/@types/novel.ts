import type { EntityId } from './brandedId';

export type NovelEntity = {
  id: EntityId['novel'];
  text: string;
};

export type NovelInfo = {
  title: string;
  authorSurname: string;
  authorGivenName: string | null;
};

export type AozoraWork = {
  作品ID: number;
  作品名: string;
  作品名読み: string;
  ソート用読み: string;
  副題: string | null;
  副題読み: string | null;
  原題: string | null;
  初出: string;
  分類番号: string;
  文字遣い種別: string;
  作品著作権フラグ: string;
  公開日: string;
  最終更新日: string;
  図書カードURL: string;
  人物ID: number;
  姓名: string;
  姓: string;
  名: string;
  姓読み: string;
  名読み: string;
  姓読みソート用: string;
  名読みソート用: string;
  姓ローマ字: string;
  名ローマ字: string;
  生年月日: string;
  没年月日: string;
  人物著作権フラグ: string;
  役割フラグ: string;
  底本名1: string;
  底本出版社名1: string;
  底本初版発行年1: string;
  入力に使用した版1: string;
  校正に使用した版1: string;
  底本の親本名1: string | null;
  底本の親本出版社名1: string | null;
  底本の親本初版発行年1: string | null;
  底本名2: string | null;
  底本出版社名2: string | null;
  底本初版発行年2: string | null;
  入力に使用した版2: string | null;
  校正に使用した版2: string | null;
  底本の親本名2: string | null;
  底本の親本出版社名2: string | null;
  底本の親本初版発行年2: string | null;
  入力者: string;
  校正者: string;
  テキストファイルURL: string;
  テキストファイル最終更新日: string;
  テキストファイル符号化方式: string;
  テキストファイル文字集合: string;
  テキストファイル修正回数: number;
  'XHTML/HTMLファイルURL': string;
  'XHTML/HTMLファイル最終更新日': string;
  'XHTML/HTMLファイル符号化方式': string;
  'XHTML/HTMLファイル文字集合': string;
  'XHTML/HTMLファイル修正回数': number;

  文字数: number;
  書き出し: string;
  累計アクセス数: number;
  カテゴリ: string;
};
