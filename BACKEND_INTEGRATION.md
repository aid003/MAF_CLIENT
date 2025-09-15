# Интеграция с бэкендом: История чатов и RAG

## 📋 Обзор изменений

Фронтенд теперь отправляет расширенные данные в сокет `chat message`, включая:

- Параметр `useRAG` для выбора режима ответа
- Массив `history` с последними сообщениями чата
- Тип поиска `searchType`

## 🔌 Формат данных от фронтенда

### Структура payload

```typescript
interface ChatPayload {
  text: string; // Текущий вопрос пользователя
  searchType: string; // Тип поиска: "1", "2", "3"
  useRAG: boolean; // true = по документам, false = общий ответ
  history: ChatHistoryMessage[]; // Массив последних сообщений
}

interface ChatHistoryMessage {
  sender: "assistant" | "user";
  text: string;
  searchType?: string;
  useRAG?: boolean;
}
```

### Пример входящих данных

```json
{
  "text": "Расскажи подробнее о тарифах",
  "searchType": "1",
  "useRAG": true,
  "history": [
    {
      "sender": "user",
      "text": "Какие есть тарифы?",
      "searchType": "1",
      "useRAG": true
    },
    {
      "sender": "assistant",
      "text": "В системе доступны следующие тарифы...",
      "searchType": "1",
      "useRAG": true
    }
  ]
}
```

## 🛠️ Требуемые изменения в бэкенде

### 1. Обработка параметра `useRAG`

```python
# Пример для Python/FastAPI
def handle_chat_message(data: dict):
    text = data.get("text")
    search_type = data.get("searchType", "1")
    use_rag = data.get("useRAG", True)
    history = data.get("history", [])

    if use_rag:
        # Поиск по документам с использованием RAG
        response = rag_search(text, search_type, history)
    else:
        # Общий ответ без привязки к документам
        response = general_llm_response(text, history)

    return response
```

### 2. Использование истории чата

```python
def rag_search(text: str, search_type: str, history: list):
    # Подготовка контекста из истории
    context = prepare_context_from_history(history)

    # Поиск релевантных документов
    relevant_docs = search_documents(text, search_type)

    # Генерация ответа с учетом контекста
    response = generate_response_with_context(
        question=text,
        documents=relevant_docs,
        chat_history=context
    )

    return response

def prepare_context_from_history(history: list):
    """Преобразует историю чата в контекст для LLM"""
    context = ""
    for msg in history:
        role = "User" if msg["sender"] == "user" else "Assistant"
        context += f"{role}: {msg['text']}\n"
    return context
```

### 3. Обработка типов поиска

```python
def search_documents(text: str, search_type: str):
    if search_type == "1":
        # Гибридный поиск (alpha: 0.7)
        return hybrid_search(text, alpha=0.7)
    elif search_type == "2":
        # Семантический поиск
        return semantic_search(text)
    elif search_type == "3":
        # Поиск по ключевым словам
        return keyword_search(text)
    else:
        return hybrid_search(text, alpha=0.7)  # По умолчанию
```

### 4. Генерация ответов без RAG

```python
def general_llm_response(text: str, history: list):
    """Генерация общего ответа без привязки к документам"""
    context = prepare_context_from_history(history)

    prompt = f"""
    Контекст предыдущего разговора:
    {context}

    Текущий вопрос: {text}

    Ответь на вопрос, используя общие знания.
    """

    response = llm.generate(prompt)
    return response
```

## 📡 Сокет события

### Входящее событие: `chat message`

```javascript
// Фронтенд отправляет
socket.emit("chat message", {
  text: "вопрос",
  searchType: "1",
  useRAG: true,
  history: [...]
});
```

### Исходящие события

```javascript
// Частичный ответ (стриминг)
socket.emit("partial answer", {
  text: "часть ответа...",
});

// Финальный ответ
socket.emit("chat message", {
  text: "полный ответ",
  searchType: "1",
  useRAG: true,
});
```

## 🔧 Настройки

### Переменные окружения фронтенда

```bash
# .env.local
NEXT_PUBLIC_CHAT_HISTORY_LIMIT=10  # Количество сообщений в истории
```

### Рекомендуемые настройки бэкенда

```python
# config.py
MAX_HISTORY_LENGTH = 10
DEFAULT_SEARCH_TYPE = "1"
DEFAULT_USE_RAG = True
```

## 🚀 Пример полной реализации

```python
from fastapi import FastAPI
from socketio import AsyncServer
import asyncio

app = FastAPI()
sio = AsyncServer()

@sio.event
async def chat_message(sid, data):
    try:
        text = data.get("text")
        search_type = data.get("searchType", "1")
        use_rag = data.get("useRAG", True)
        history = data.get("history", [])

        # Обработка запроса
        if use_rag:
            response = await process_rag_request(text, search_type, history)
        else:
            response = await process_general_request(text, history)

        # Отправка ответа
        await sio.emit("chat message", {
            "text": response,
            "searchType": search_type,
            "useRAG": use_rag
        }, room=sid)

    except Exception as e:
        await sio.emit("error", {"message": str(e)}, room=sid)

async def process_rag_request(text: str, search_type: str, history: list):
    # 1. Подготовка контекста
    context = prepare_context(history)

    # 2. Поиск документов
    docs = search_documents(text, search_type)

    # 3. Генерация ответа
    response = generate_rag_response(text, docs, context)

    return response

async def process_general_request(text: str, history: list):
    # Генерация общего ответа
    context = prepare_context(history)
    response = generate_general_response(text, context)
    return response
```

## ⚠️ Важные моменты

1. **Производительность**: История ограничена 10 сообщениями по умолчанию
2. **Контекст**: Используйте историю для более релевантных ответов
3. **Типизация**: Все поля опциональны, но рекомендуется валидация
4. **Обратная совместимость**: Старые клиенты без `useRAG` должны работать с `useRAG=true` по умолчанию
5. **Безопасность**: Валидируйте входящие данные и ограничивайте размер истории

## 🧪 Тестирование

```python
# Тестовые данные
test_payload = {
    "text": "Тестовый вопрос",
    "searchType": "1",
    "useRAG": True,
    "history": [
        {"sender": "user", "text": "Привет", "searchType": "1", "useRAG": True},
        {"sender": "assistant", "text": "Привет! Чем могу помочь?", "searchType": "1", "useRAG": True}
    ]
}

# Тест обработки
result = handle_chat_message(test_payload)
assert result is not None
```

## 📝 Чек-лист для внедрения

- [ ] Обновить обработчик сокета `chat message`
- [ ] Добавить поддержку параметра `useRAG`
- [ ] Реализовать обработку массива `history`
- [ ] Добавить валидацию входящих данных
- [ ] Обновить логику поиска документов
- [ ] Реализовать генерацию ответов без RAG
- [ ] Добавить тесты для новых функций
- [ ] Обновить документацию API
