use std::path::PathBuf;
use tauri::Manager;
struct DocumentRoot(PathBuf);

#[tauri::command]
fn read_document(root: tauri::State<'_, DocumentRoot>, name: String) -> Result<String, String> {
    document_core::read_document(&root.0, &name)
}
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let root=app.path().app_data_dir()?.join("documents");
            std::fs::create_dir_all(&root)?;
            let file=root.join("hello.txt");
            if !file.exists() { std::fs::write(file,"Hello from the Rust command core")?; }
            app.manage(DocumentRoot(root));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![read_document])
        .run(tauri::generate_context!())
        .expect("Tauri application failed");
}
