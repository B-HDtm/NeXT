import subprocess

def run_cpp(file):
    exe = file.replace('.cpp', '')
    subprocess.run(['g++', f'server-cpp/{file}', '-lcrypto', '-o', f'server-cpp/{exe}'])
    result = subprocess.run([f'./server-cpp/{exe}'], capture_output=True, text=True)
    return result.stdout.strip()

def run_php(file):
    result = subprocess.run(['php', f'api-php/{file}'], capture_output=True, text=True)
    return result.stdout.strip()

def run_java(file):
    class_name = file.replace('.java', '')
    subprocess.run(['javac', f'logger-java/{file}'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    result = subprocess.run(['java', '-cp', 'logger-java', class_name], capture_output=True, text=True)
    return result.stdout.strip()

def run_js(file):
    result = subprocess.run(['node', f'blockchain-js/{file}'], capture_output=True, text=True)
    return result.stdout.strip()

def main():
    print("=== Running C++ programs ===")
    for f in ['Hasher.cpp', 'Hasher2.cpp']:
        print(run_cpp(f))
        print()

    print("=== Running PHP scripts ===")
    for f in ['send.php', 'notify.php']:
        print(run_php(f))
        print()

    print("=== Running Java programs ===")
    for f in ['Logger.java', 'Notifier.java']:
        print(run_java(f))
        print()

    print("=== Running JS scripts ===")
    for f in ['blockchain.js']:
        print(run_js(f))
        print()

if __name__ == "__main__":
    main()
