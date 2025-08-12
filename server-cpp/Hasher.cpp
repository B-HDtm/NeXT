#include <iostream>
#include <sstream>
#include <iomanip>
#include <ctime>
#include <string>
#include <openssl/sha.h> // OpenSSL  Required

std::string sha256(const std::string &str) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256((unsigned char*)str.c_str(), str.size(), hash);
    std::stringstream ss;
    for(int i = 0; i < SHA256_DIGEST_LENGTH; ++i)
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    return ss.str();
}

struct Block {
    int index;
    std::string timestamp;
    int amount;
    std::string prevHash;
    std::string hash;
    int nonce;

    std::string calculateHash() {
        std::stringstream ss;
        ss << index << timestamp << amount << prevHash << nonce;
        return sha256(ss.str());
    }

    void mineBlock(int difficulty) {
        std::string target(difficulty, '0');
        nonce = 0;
        do {
            hash = calculateHash();
            nonce++;
        } while(hash.substr(0, difficulty) != target);
    }
};

std::string getCurrentTime() {
    time_t now = time(nullptr);
    char buf[20];
    strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S", localtime(&now));
    return std::string(buf);
}

int main() {
    srand(time(nullptr));
    Block genesis{0, getCurrentTime(), 100, "0", "", 0};
    genesis.mineBlock(2);
    std::cout << "NXT ⥉ C++ Hasher.cpp: Block 0 mined: " << genesis.hash << std::endl;

    Block block1{1, getCurrentTime(), 250, genesis.hash, "", 0};
    block1.mineBlock(2);
    std::cout << "NXT ⥉ C++ Hasher.cpp: Block 1 mined: " << block1.hash << std::endl;

    return 0;
}
