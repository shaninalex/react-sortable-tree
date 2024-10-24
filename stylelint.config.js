module.exports = {
    extends: 'stylelint-config-recommended-scss',
    rules: {
        'color-no-invalid-hex': true,
        'max-nesting-depth': 10,
        'selector-max-id': 0,
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'extends',
                    'apply',
                    'tailwind',
                    'components',
                    'utilities',
                    'screen',
                    'mixin',
                    'function',
                    'if',
                    'return',
                    'else',
                    'error',
                    'include',
                ],
            },
        ],
    },
}
