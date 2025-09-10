import axios from 'axios';
import { SERVER_URL } from '@env';
import type {
  SurveyDraftResponse,
  SurveySubmitResponse,
  SurveyMineItem,
  SurveyDetail,
  SurveyReason,
} from '../types/survey';
import { withPath } from '../utils/url';

const API = axios.create({
  baseURL: SERVER_URL, // 단일 환경변수만 사용
  withCredentials: true,
});

function authHeaders(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createDraft(
  token: string,
  payload: { conversationId: string; reason: SurveyReason; answers?: number[]; summary?: string }
): Promise<SurveyDraftResponse> {
  const url = withPath(SERVER_URL, '/surveys/draft');
  const res = await API.post<SurveyDraftResponse>(url, payload, { headers: authHeaders(token) });
  return res.data;
}

export async function submitSurvey(
  token: string,
  id: string,
  payload: { answers: number[]; summary?: string }
): Promise<SurveySubmitResponse> {
  const url = withPath(SERVER_URL, `/surveys/${id}/submit`);
  const res = await API.post<SurveySubmitResponse>(url, payload, { headers: authHeaders(token) });
  return res.data;
}

export async function listMySurveys(token: string): Promise<SurveyMineItem[]> {
  const url = withPath(SERVER_URL, '/surveys/me');
  const res = await API.get<SurveyMineItem[]>(url, { headers: authHeaders(token) });
  return res.data;
}

export async function getSurvey(token: string, id: string): Promise<SurveyDetail> {
  const url = withPath(SERVER_URL, `/surveys/${id}`);
  const res = await API.get<SurveyDetail>(url, { headers: authHeaders(token) });
  return res.data;
}

export async function deleteSurvey(token: string, id: string): Promise<{ ok: boolean }> {
  const url = withPath(SERVER_URL, `/surveys/${id}`);
  const res = await API.delete<{ ok: boolean }>(url, { headers: authHeaders(token) });
  return res.data;
}
