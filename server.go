package main

import (
	"encoding/json" // Для кодирования данных в формат JSON
	"net/http"      // Стандартная библиотека для работы с HTTP
	"os"            // Для работы с файловой системой (например, для сканирования папок)
	"path/filepath" // Для удобной работы с путями к файлам
	"strings"       // Для работы со строками (например, для проверки расширения файла)
)

func main() {
	// http.ListenAndServe(":8080", http.FileServer(http.Dir("public")))
	http.Handle("/", http.FileServer(http.Dir("public")))
	http.HandleFunc("/api/songs", getSongs)
	http.ListenAndServe(":8080", nil)
}

func getSongs(w http.ResponseWriter, r *http.Request) {
	var files []string

	root := "public/content/music"

	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".mp3") {
			urlPath := strings.TrimPrefix(path, "public\\")
			urlPath = filepath.ToSlash(urlPath)
			files = append(files, urlPath)
		}
		return nil
	})

	if err != nil {
		http.Error(w, "Не удалось найти песни", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(files)

}
