import os
import subprocess

def run_git(cmd):
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=os.getcwd())
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
    return result.returncode

run_git("git status")
run_git("git remote add origin https://github.com/YashwanthNavari/sandbox")
run_git("git remote set-url origin https://github.com/YashwanthNavari/sandbox")
run_git("git add .")
run_git("git commit -m \"Update Slide 15 End-to-End Authentication UI\"")
run_git("git branch -M main")
run_git("git push -u origin main")
