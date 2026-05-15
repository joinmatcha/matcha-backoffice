import { spawn } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const mode = process.argv[2] ?? "dev"
const envFile = resolve(process.cwd(), ".env.local")

if (existsSync(envFile)) {
  const content = readFileSync(envFile, "utf8")

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) continue

    const separatorIndex = trimmed.indexOf("=")
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

const port = process.env.BACKOFFICE_PORT ?? "3000"
const nextBin = resolve(process.cwd(), "node_modules", "next", "dist", "bin", "next")
const args = [nextBin, mode]

if (mode === "dev" || mode === "start") {
  args.push("-p", port)
}

const child = spawn(process.execPath, args, {
  stdio: "inherit",
  env: process.env,
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
