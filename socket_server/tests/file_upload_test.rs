mod common;

#[cfg(test)]
mod tests {
    use crate::common::{self, TEST_SERVER_ADDR};

    const TEST_IMAGE_PATH: &str = "./test_files/test.png";
    const FILE_UPLOAD_ENDPOINT: &str = "file_upload";

    #[tokio::test]
    async fn upload_file() -> Result<(), Box<dyn std::error::Error>> {
        common::start_test_server().await;

        let image_bytes = std::fs::read(TEST_IMAGE_PATH)?;
        let form: reqwest::multipart::Form = reqwest::multipart::Form::new().part(
            "image",
            reqwest::multipart::Part::bytes(image_bytes).file_name("test.png"),
        );

        let client = reqwest::Client::new();
        let response = client
            .post(format!("http://{TEST_SERVER_ADDR}/{FILE_UPLOAD_ENDPOINT}"))
            .multipart(form)
            .send()
            .await?;

        assert_eq!(response.status(), reqwest::StatusCode::OK);

        let image_url = response.text().await?;
        let file_path = &format!("./public/{}", image_url);
        let file_exists = std::fs::metadata(file_path)?.is_file();

        assert!(file_exists);
        std::fs::remove_file(file_path)?;

        Ok(())
    }
}
