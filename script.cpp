#include <iostream>
#include <boost/filesystem.hpp>
#include <openssl/sha.h>
#include <curl/curl.h>
#include <random>
#include <sstream>
#include <iomanip>

std::string hashFile(const std::string& path) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    FILE *file = fopen(path.c_str(), "rb");
    if(!file) return "";

    char buf[1024];
    int bytesRead = 0;
    while((bytesRead = fread(buf, 1, 1024, file)))
        SHA256_Update(&sha256, buf, bytesRead);

    SHA256_Final(hash, &sha256);
    fclose(file);  // Close the file

    std::ostringstream hashStream;
    for(int i = 0; i < SHA256_DIGEST_LENGTH; i++)
        hashStream << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];

    return hashStream.str();
}

void xorHashes(std::string& hash1, const std::string& hash2) {
    for(size_t i = 0; i < hash1.size(); i++)
        hash1[i] ^= hash2[i];
}

void sendPostRequest(const std::string& hash, int randomNumber, const std::string& apiKey) {
    CURL *curl;
    CURLcode res;

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();
    if(curl) {
        std::string url = "http://localhost:3000";
        std::string postData = "hash=" + hash + "&randomNumber=" + std::to_string(randomNumber) + "&apiKey=" + apiKey;

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, postData.c_str());

        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));

        curl_easy_cleanup(curl);
    }

    curl_global_cleanup();
}

int main(int argc, char* argv[]) {
    if(argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <API Key>\n";
        return 1;
    }
    std::string apiKey = argv[1];

    boost::filesystem::recursive_directory_iterator end;
    std::string finalHash(64, 0);
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, 1000000);
    int randomNumber = dis(gen);

    for(boost::filesystem::recursive_directory_iterator i("./"); i != end; ++i) {
        const boost::filesystem::path cp = (*i);
        if(!boost::filesystem::is_directory(cp) && cp.string().find("node_modules") == std::string::npos) {
            std::string fileHash = hashFile(cp.string());
            xorHashes(finalHash, fileHash);
        }
    }

    std::string randomHash = hashFile(std::to_string(randomNumber));
    xorHashes(finalHash, randomHash);

    sendPostRequest(finalHash, randomNumber, apiKey);

    return 0;
}
