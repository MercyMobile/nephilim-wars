# Zerotype World Builder Design

## Project Context
Building a zerotype world builder within Godot for the "Nephilim-Wars" project. This architecture bridges an external orchestrator (Gemini CLI) for vibe coding the environment during development, and an internal engine (godot-llm) for intelligent, autonomous procedural generation and NPC behavior at runtime. Both operate entirely locally, relying on Ollama and llama.cpp.

## 1. Architecture & Data Flow
The world builder operates on two distinct loops:
- **Build-Time (External):** Gemini CLI takes natural language instructions, processes them via a local model (Ollama), and communicates with the active Godot Editor via an MCP WebSocket server. This allows for real-time node generation, script attachment, and parameter tuning within the editor viewport.
- **Run-Time (Internal):** When the game runs, the `godot-llm` GDExtension drives entity logic entirely within the C++ layer. NPCs and procedural systems use `LlmDB` (a local vector database) and `GdLlama` to reason about their surroundings, load past lore, and generate strictly formatted JSON payloads that the GDScript backend translates into procedural geometry or dialog.

## 2. External Orchestration (Godot MCP & Gemini)
To connect the Gemini CLI to your Godot project for autonomous vibe coding, we will implement the **In-Editor WebSocket (`ee0pdt/Godot-MCP`)** approach.

**Components:**
1. **Godot MCP Plugin:** Install the WebSocket MCP plugin into the Godot project's `addons` folder. This runs a WebSocket server on a specific port inside the active Godot Editor.
2. **MCP Relay (Node.js):** Since Gemini CLI connects to MCP servers via `stdio`, we need a lightweight Node.js relay script that translates `stdio` messages from the CLI into WebSocket messages sent to the Godot Editor.
3. **Gemini Configuration:** Update `C:\Users\velez\.gemini\settings.json` to register this Node.js relay as a new MCP server.
4. **Local LLM Override:** Define the required environment variables (`GOOGLE_GEMINI_BASE_URL` and `AUTH_METHOD`) to force the Gemini CLI to route its cognitive reasoning through your local Ollama instance (e.g., using `llama3.1:8b-instruct`) instead of Google's cloud servers.

## 3. Internal Inference (godot-llm)
This section details how the game itself functions autonomously, completely disconnected from the Gemini CLI or external editor processes.

**Components:**
1. **`godot-llm` Integration:** Integrate the official `Adriankhl/godot-llm` plugin (GDExtension for llama.cpp) into the `addons` directory.
2. **Cognitive Nodes:** Expose and use nodes such as `GdLlama` for language generation, `GdEmbedding` for vector conversion, and `LlmDB` for local, persistent memory storage.
3. **Retrieval-Augmented Generation (RAG):** When an event occurs, an NPC or the world manager will query `LlmDB` for the top-K relevant events, inject them into its prompt, and generate its next action.
4. **Structured Output (JSON Schema):** Enforce strict grammatical outputs via `generate_text_json()` or `generate_text_grammar()` to guarantee the model outputs a parseable dictionary containing precise data types (e.g., `"global_position": { "x": 10.5 }`) instead of unstructured chat.

This prevents the engine from crashing due to unexpected text strings when translating intent into procedural geometry.