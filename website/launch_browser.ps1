param(
    [string]$Url = "file:///C:/Users/hua.bryant5116/.gemini/antigravity-ide/scratch/party-hard-people/index.html",
    [string]$Browser = "edge"
)

$code = @"
using System;
using System.Runtime.InteropServices;

public class Win32Launcher {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct STARTUPINFO {
        public Int32 cb;
        public string lpReserved;
        public string lpDesktop;
        public string lpTitle;
        public Int32 dwX;
        public Int32 dwY;
        public Int32 dwXSize;
        public Int32 dwYSize;
        public Int32 dwXCountChars;
        public Int32 dwYCountChars;
        public Int32 dwFillAttribute;
        public Int32 dwFlags;
        public Int16 wShowWindow;
        public Int16 cbReserved2;
        public IntPtr lpReserved2;
        public IntPtr hStdInput;
        public IntPtr hStdOutput;
        public IntPtr hStdError;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct PROCESS_INFORMATION {
        public IntPtr hProcess;
        public IntPtr hThread;
        public Int32 dwProcessId;
        public Int32 dwThreadId;
    }

    [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern bool CreateProcess(
        string lpApplicationName,
        string lpCommandLine,
        IntPtr lpProcessAttributes,
        IntPtr lpThreadAttributes,
        bool bInheritHandles,
        uint dwCreationFlags,
        IntPtr lpEnvironment,
        string lpCurrentDirectory,
        ref STARTUPINFO lpStartupInfo,
        out PROCESS_INFORMATION lpProcessInformation);

    public static string Launch(string exePath, string cmdLine) {
        STARTUPINFO si = new STARTUPINFO();
        si.cb = Marshal.SizeOf(si);
        si.lpDesktop = @"WinSta0\Default";
        si.dwFlags = 1; // STARTF_USESHOWWINDOW
        si.wShowWindow = 3; // SW_MAXIMIZE
        PROCESS_INFORMATION pi = new PROCESS_INFORMATION();

        bool ok = CreateProcess(exePath, cmdLine, IntPtr.Zero, IntPtr.Zero, false, 0, IntPtr.Zero, null, ref si, out pi);
        if (!ok) {
            return "Failed: " + Marshal.GetLastWin32Error();
        }
        return "Success PID: " + pi.dwProcessId;
    }
}
"@

Add-Type -TypeDefinition $code

$profileDir = "C:\Users\hua.bryant5116\.gemini\antigravity-ide\scratch\browser_profile"
if (!(Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

$exe = if ($Browser -eq "chrome") {
    "C:\Program Files\Google\Chrome\Application\chrome.exe"
} else {
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

$cmd = "`"$exe`" --user-data-dir=`"$profileDir`" --no-first-run --no-default-browser-check `"$Url`""
$result = [Win32Launcher]::Launch($exe, $cmd)
Write-Output $result
